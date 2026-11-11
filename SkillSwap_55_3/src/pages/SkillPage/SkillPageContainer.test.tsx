import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ROUTES } from '@/shared/lib/constants'
import type { User } from '@/shared/types'
import { store } from '@/store'
import { clearAuthSession, setAuthAccount, setAuthSession } from '@/store/slices/authSlice'
import { clearLocalUser, setLocalUser, setUsersStatus } from '@/store/slices/usersSlice'

import { SkillPageContainer } from './SkillPageContainer'

vi.mock('./SkillPage', () => ({
  SkillPage: () => <div>Страница навыка пользователя</div>,
}))

const localUser: User = {
  id: 'local-user-id',
  name: 'Алексей',
  birthDate: '1993-04-15',
  gender: 'preferNotToSay',
  cityId: 'saint-petersburg',
  avatarUrl: null,
  description: '',
  offeredSkill: {
    title: 'Видеомонтаж',
    categoryId: 'creativity-art',
    subcategoryId: 'video-editing',
    description: 'Научу основам видеомонтажа',
    imageUrls: ['data:image/png;base64,dGVzdA=='],
  },
  learningSubcategoryIds: ['english'],
  likesCount: 0,
  createdAt: '2026-09-09T12:00:00.000Z',
}

const LocationStateProbe = () => {
  const location = useLocation()

  return <output data-testid="location-state">{JSON.stringify(location.state)}</output>
}

const renderSkillPageContainer = (registrationCompleted: boolean) =>
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/skill/${localUser.id}`,
            state: registrationCompleted ? { registrationCompleted: true } : null,
          },
        ]}
      >
        <LocationStateProbe />

        <Routes>
          <Route path={ROUTES.SKILL} element={<SkillPageContainer />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('SkillPageContainer — завершение регистрации', () => {
  beforeEach(() => {
    store.dispatch(clearLocalUser())
    store.dispatch(clearAuthSession())
    store.dispatch(setUsersStatus('success'))

    store.dispatch(setLocalUser(localUser))
    store.dispatch(
      setAuthAccount({
        userId: localUser.id,
        email: 'user@example.com',
        password: 'Password1!',
      }),
    )
    store.dispatch(
      setAuthSession({
        userId: localUser.id,
      }),
    )
  })

  it('показывает модалку успешной регистрации и закрывает её, сохраняя страницу навыка', async () => {
    const user = userEvent.setup()

    renderSkillPageContainer(true)

    expect(screen.getByText('Страница навыка пользователя')).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Ваше предложение создано',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('Теперь вы можете предложить обмен')).toBeInTheDocument()

    expect(screen.getByTestId('location-state')).toHaveTextContent('{"registrationCompleted":true}')

    await user.click(
      screen.getByRole('button', {
        name: 'Готово',
      }),
    )

    expect(
      screen.queryByRole('heading', {
        name: 'Ваше предложение создано',
      }),
    ).not.toBeInTheDocument()

    expect(screen.getByText('Страница навыка пользователя')).toBeInTheDocument()

    expect(screen.getByTestId('location-state')).toHaveTextContent('null')
  })

  it('не показывает модалку при обычном открытии страницы навыка', () => {
    renderSkillPageContainer(false)

    expect(screen.getByText('Страница навыка пользователя')).toBeInTheDocument()

    expect(
      screen.queryByRole('heading', {
        name: 'Ваше предложение создано',
      }),
    ).not.toBeInTheDocument()
  })
})
