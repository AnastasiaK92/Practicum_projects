import { beforeEach, describe, expect, it } from 'vitest'
import { Provider } from 'react-redux'
import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ROUTES } from '@/shared/lib/constants'
import { store } from '@/store'
import {
  resetRegistrationDraft,
  updateStep1Draft,
} from '@/store/slices/registrationSlice'

import { RegistrationStep1 } from './RegistrationStep1'

const renderRegistrationStep1 = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[ROUTES.REGISTER]}>
        <Routes>
          <Route
            path={ROUTES.REGISTER}
            element={<RegistrationStep1 />}
          />
          <Route
            path={ROUTES.REGISTER_STEP_2}
            element={<div>Второй шаг</div>}
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('RegistrationStep1', () => {
  beforeEach(() => {
    store.dispatch(resetRegistrationDraft())
  })

  it('показывает ошибки и блокирует переход при невалидных данных', async () => {
    const user = userEvent.setup()

    renderRegistrationStep1()

    await user.type(
      screen.getByLabelText('Email'),
      'incorrect-email',
    )
    await user.type(screen.getByLabelText('Пароль'), 'weak')
    await user.click(
      screen.getByRole('button', { name: 'Далее' }),
    )

    expect(
      screen.getByText('Некорректный формат email'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Пароль должен содержать от 8 до 64 символов',
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Второй шаг'),
    ).not.toBeInTheDocument()
    expect(store.getState().registration.draft).toEqual({})
  })

  it('сохраняет валидные данные и переходит на второй шаг', async () => {
    const user = userEvent.setup()

    renderRegistrationStep1()

    await user.type(
      screen.getByLabelText('Email'),
      'user@example.com',
    )
    await user.type(
      screen.getByLabelText('Пароль'),
      'Password1!',
    )
    await user.click(
      screen.getByRole('button', { name: 'Далее' }),
    )

    expect(store.getState().registration.draft).toEqual({
      email: 'user@example.com',
      password: 'Password1!',
    })
    expect(screen.getByText('Второй шаг')).toBeInTheDocument()
  })

  it('заполняет поля из draft при повторном открытии', () => {
    store.dispatch(
      updateStep1Draft({
        email: 'saved@example.com',
        password: 'SavedPassword1!',
      }),
    )

    renderRegistrationStep1()

    expect(screen.getByLabelText('Email')).toHaveValue(
      'saved@example.com',
    )
    expect(screen.getByLabelText('Пароль')).toHaveValue(
      'SavedPassword1!',
    )
  })
})
