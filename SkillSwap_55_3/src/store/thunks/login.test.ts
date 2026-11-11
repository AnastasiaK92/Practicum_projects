import { configureStore } from '@reduxjs/toolkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount, AuthSession, User } from '@/shared/types'
import type { AppDispatch } from '@/store'
import authReducer from '@/store/slices/authSlice'

import { login, type LoginCredentials } from './login'

const account: AuthAccount = {
  userId: 'local-user-id',
  email: 'user@example.com',
  password: 'Password1!',
}

const mockUser: User = {
  id: 'mock-user-id',
  name: 'Моковый пользователь',
  birthDate: '1990-01-01',
  gender: 'male',
  cityId: 'moscow',
  avatarUrl: null,
  description: '',
  offeredSkill: {
    title: 'Фотография',
    categoryId: 'creativity-art',
    subcategoryId: 'photography',
    description: 'Научу основам фотографии',
    imageUrls: [],
  },
  learningSubcategoryIds: ['english'],
  likesCount: 10,
  createdAt: '2026-01-01T00:00:00.000Z',
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

type TestStore = ReturnType<typeof createTestStore>

const runLogin = (testStore: TestStore, credentials: LoginCredentials) =>
  login(credentials)(testStore.dispatch as unknown as AppDispatch)

describe('login', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('создаёт активную сессию для локально зарегистрированного пользователя', () => {
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
    const testStore = createTestStore()

    const result = runLogin(testStore, {
      email: account.email,
      password: account.password,
    })

    expect(result).toBe(true)
    expect(testStore.getState().auth.account).toEqual(account)
    expect(testStore.getState().auth.session).toEqual({
      userId: account.userId,
    })
    expect(testStore.getState().auth.status).toBe('succeeded')
    expect(testStore.getState().auth.error).toBeNull()
  })

  it('сохраняет созданную сессию в localStorage', () => {
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
    const testStore = createTestStore()

    runLogin(testStore, {
      email: account.email,
      password: account.password,
    })

    expect(storageService.get<AuthSession>(STORAGE_KEYS.AUTH_SESSION)).toEqual({
      userId: account.userId,
    })
  })

  it.each([
    {
      title: 'неверном email',
      credentials: {
        email: 'wrong@example.com',
        password: account.password,
      },
    },
    {
      title: 'неверном пароле',
      credentials: {
        email: account.email,
        password: 'WrongPassword1!',
      },
    },
  ])('отклоняет вход при $title', ({ credentials }) => {
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
    const testStore = createTestStore()

    const result = runLogin(testStore, credentials)

    expect(result).toBe(false)
    expect(testStore.getState().auth.session).toBeNull()
    expect(testStore.getState().auth.status).toBe('failed')
    expect(testStore.getState().auth.error).toBe('Email или пароль введен неверно.')
    expect(storageService.get(STORAGE_KEYS.AUTH_SESSION)).toBeNull()
  })

  it('не позволяет войти по данным мокового пользователя без локального AuthAccount', () => {
    storageService.set(STORAGE_KEYS.LOCAL_USER, mockUser)
    const testStore = createTestStore()

    const result = runLogin(testStore, {
      email: 'mock@example.com',
      password: 'Password1!',
    })

    expect(result).toBe(false)
    expect(testStore.getState().auth.session).toBeNull()
    expect(storageService.get(STORAGE_KEYS.AUTH_SESSION)).toBeNull()
  })

  it('не создаёт Redux-сессию, если localStorage не сохранил AuthSession', () => {
    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
    const testStore = createTestStore()

    vi.spyOn(storageService, 'set').mockReturnValue(false)

    const result = runLogin(testStore, {
      email: account.email,
      password: account.password,
    })

    expect(result).toBe(false)
    expect(testStore.getState().auth.session).toBeNull()
    expect(testStore.getState().auth.status).toBe('failed')
  })

  it('восстанавливает сохранённую сессию при повторной инициализации authSlice', async () => {
    const session: AuthSession = {
      userId: account.userId,
    }

    storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
    storageService.set(STORAGE_KEYS.AUTH_SESSION, session)
    vi.resetModules()

    const { default: freshAuthReducer } = await import('@/store/slices/authSlice')
    const restoredState = freshAuthReducer(undefined, { type: 'unknown' })

    expect(restoredState.account).toEqual(account)
    expect(restoredState.session).toEqual(session)
  })
})
