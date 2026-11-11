import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it } from 'vitest'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ROUTES, STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount, AuthSession } from '@/shared/types'
import authReducer from '@/store/slices/authSlice'

import LoginPage from './LoginPage'

const account: AuthAccount = {
  userId: 'local-user-id',
  email: 'user@example.com',
  password: 'Password1!',
}

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        account: null,
        session: null,
        status: 'idle' as const,
        error: null,
      },
    },
  })

const renderLoginPage = () => {
  const testStore = createTestStore()

  const renderResult = render(
    <Provider store={testStore}>
      <MemoryRouter initialEntries={[ROUTES.LOGIN]}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.HOME} element={<div>Главная страница</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

  return {
    testStore,
    ...renderResult,
  }
}

describe('LoginPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('входит под локальным аккаунтом и открывает главную страницу', async () => {
    const user = userEvent.setup()
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
    const { testStore } = renderLoginPage()

    await user.type(screen.getByLabelText('Email'), account.email)
    await user.type(screen.getByLabelText('Пароль'), account.password)
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(screen.getByText('Главная страница')).toBeInTheDocument()
    expect(testStore.getState().auth.session).toEqual({
      userId: account.userId,
    })
    expect(storageService.get<AuthSession>(STORAGE_KEYS.AUTH_SESSION)).toEqual({
      userId: account.userId,
    })
  })

  it('показывает ошибку и не выполняет переход при неверном пароле', async () => {
    const user = userEvent.setup()
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
    const { testStore } = renderLoginPage()

    await user.type(screen.getByLabelText('Email'), account.email)
    await user.type(screen.getByLabelText('Пароль'), 'WrongPassword1!')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(screen.getByText('Email или пароль введен неверно.')).toBeInTheDocument()
    expect(screen.queryByText('Главная страница')).not.toBeInTheDocument()
    expect(testStore.getState().auth.session).toBeNull()
  })

  it('убирает показанную ошибку после изменения данных формы', async () => {
    const user = userEvent.setup()
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)

    renderLoginPage()

    await user.type(screen.getByLabelText('Email'), account.email)
    await user.type(screen.getByLabelText('Пароль'), 'WrongPassword1!')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(screen.getByText('Email или пароль введен неверно.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Пароль'), 'a')

    expect(screen.queryByText('Email или пароль введен неверно.')).not.toBeInTheDocument()
  })

  it('не позволяет войти, если локальный AuthAccount отсутствует', async () => {
    const user = userEvent.setup()
    const { testStore } = renderLoginPage()

    await user.type(screen.getByLabelText('Email'), 'mock@example.com')
    await user.type(screen.getByLabelText('Пароль'), 'Password1!')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(screen.getByText('Email или пароль введен неверно.')).toBeInTheDocument()
    expect(screen.queryByText('Главная страница')).not.toBeInTheDocument()
    expect(testStore.getState().auth.session).toBeNull()
    expect(storageService.get(STORAGE_KEYS.AUTH_SESSION)).toBeNull()
  })
})
