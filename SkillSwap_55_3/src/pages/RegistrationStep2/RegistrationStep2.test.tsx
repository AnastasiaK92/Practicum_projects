import { beforeEach, describe, expect, it } from 'vitest'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ROUTES } from '@/shared/lib/constants'
import { store } from '@/store'
import {
  resetRegistrationDraft,
  updateStep1Draft,
  updateStep2Draft,
} from '@/store/slices/registrationSlice'

import { RegistrationStep2 } from './RegistrationStep2'

const validStep2Draft = {
  name: 'Алексей',
  birthDate: '1990-05-20',
  gender: 'male' as const,
  cityId: 'moscow',
  avatarUrl: null,
  learningSubcategoryIds: ['english'],
}

const renderRegistrationStep2 = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[ROUTES.REGISTER_STEP_2]}>
        <Routes>
          <Route path={ROUTES.REGISTER} element={<div>Первый шаг</div>} />
          <Route path={ROUTES.REGISTER_STEP_2} element={<RegistrationStep2 />} />
          <Route path={ROUTES.REGISTER_STEP_3} element={<div>Третий шаг</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('RegistrationStep2', () => {
  beforeEach(() => {
    store.dispatch(resetRegistrationDraft())
  })

  it('показывает ошибки и не переходит дальше без обязательных данных', async () => {
    const user = userEvent.setup()

    renderRegistrationStep2()

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(screen.getByText('Имя: обязательное поле')).toBeInTheDocument()
    expect(screen.getByText('Дата рождения обязательна для заполнения')).toBeInTheDocument()
    expect(screen.getByText('Пол: выберите значение из списка')).toBeInTheDocument()
    expect(screen.getByText('Город: выберите значение из списка')).toBeInTheDocument()
    expect(screen.getByText('Выберите одну подкатегорию')).toBeInTheDocument()
    expect(screen.queryByText('Третий шаг')).not.toBeInTheDocument()
    expect(store.getState().registration.draft).toEqual({})
  })

  it('не принимает город, которого нет в справочнике', async () => {
    const user = userEvent.setup()

    store.dispatch(
      updateStep2Draft({
        ...validStep2Draft,
        cityId: '',
      }),
    )

    renderRegistrationStep2()

    await user.type(screen.getByPlaceholderText('Выберите город'), 'Несуществующий город')
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(screen.getByText('Город: выберите значение из списка')).toBeInTheDocument()
    expect(screen.queryByText('Третий шаг')).not.toBeInTheDocument()
  })

  it('заменяет выбранную подкатегорию и сохраняет ровно одно значение', async () => {
    const user = userEvent.setup()

    store.dispatch(
      updateStep2Draft({
        ...validStep2Draft,
        learningSubcategoryIds: [],
      }),
    )

    renderRegistrationStep2()

    const categorySelect = screen.getByLabelText('Категория навыка, которому хотите научиться')

    await user.click(categorySelect)
    await user.click(screen.getByLabelText('Иностранные языки'))
    await user.click(categorySelect)

    await user.click(screen.getByLabelText('Подкатегория навыка, которому хотите научиться'))
    await user.click(screen.getByLabelText('Английский'))
    await user.click(screen.getByLabelText('Испанский'))
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(store.getState().registration.draft.learningSubcategoryIds).toEqual(['spanish'])
    expect(screen.getByText('Третий шаг')).toBeInTheDocument()
  })

  it('сохраняет выбранный аватар как Data URL', async () => {
    const user = userEvent.setup()

    store.dispatch(updateStep2Draft(validStep2Draft))

    const { container } = renderRegistrationStep2()
    const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]')

    expect(fileInput).not.toBeNull()

    const avatarFile = new File(['avatar'], 'avatar.png', {
      type: 'image/png',
    })

    await user.upload(fileInput as HTMLInputElement, avatarFile)

    await waitFor(() => {
      expect(screen.getByAltText('Аватар пользователя').getAttribute('src')).toMatch(
        /^data:image\/png;base64,/,
      )
    })

    await user.click(screen.getByRole('button', { name: 'Продолжить' }))

    expect(store.getState().registration.draft.avatarUrl).toMatch(/^data:image\/png;base64,/)
    expect(screen.getByText('Третий шаг')).toBeInTheDocument()
  })

  it('сохраняет изменённый draft и возвращает пользователя на Step 1', async () => {
    const user = userEvent.setup()

    store.dispatch(
      updateStep1Draft({
        email: 'user@example.com',
        password: 'Password1!',
      }),
    )
    store.dispatch(updateStep2Draft(validStep2Draft))

    renderRegistrationStep2()

    const nameInput = screen.getByLabelText('Имя')
    await user.clear(nameInput)
    await user.type(nameInput, 'Мария')
    await user.click(screen.getByRole('button', { name: 'Назад' }))

    expect(screen.getByText('Первый шаг')).toBeInTheDocument()
    expect(store.getState().registration.draft).toEqual({
      email: 'user@example.com',
      password: 'Password1!',
      ...validStep2Draft,
      name: 'Мария',
    })
  })
})
