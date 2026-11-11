import { configureStore } from '@reduxjs/toolkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount, AuthSession, User } from '@/shared/types'
import authReducer from '@/store/slices/authSlice'
import catalogFiltersReducer from '@/store/slices/catalogFiltersSlice'
import favoritesReducer, { addFavorite } from '@/store/slices/favoritesSlice'
import notificationsReducer, { addNotification } from '@/store/slices/notificationsSlice'
import registrationReducer, {
  updateStep1Draft,
  updateStep2Draft,
  updateStep3Draft,
} from '@/store/slices/registrationSlice'
import requestsReducer, { addRequest } from '@/store/slices/requestsSlice'
import usersReducer, { setLocalUser } from '@/store/slices/usersSlice'

import { finalizeRegistration } from './finalizeRegistration'

const createTestStore = () =>
  configureStore({
    reducer: {
      users: usersReducer,
      auth: authReducer,
      registration: registrationReducer,
      favorites: favoritesReducer,
      requests: requestsReducer,
      notifications: notificationsReducer,
      catalogFilters: catalogFiltersReducer,
    },
  })

const oldLocalUser: User = {
  id: 'old-user-id',
  name: 'Старый пользователь',
  birthDate: '1990-01-01',
  gender: 'male',
  cityId: 'moscow',
  avatarUrl: null,
  description: '',
  offeredSkill: {
    title: 'Старый навык',
    categoryId: 'business-career',
    subcategoryId: 'team-management',
    description: 'Старое описание',
    imageUrls: ['old-image'],
  },
  learningSubcategoryIds: ['english'],
  likesCount: 5,
  createdAt: '2025-01-01T00:00:00.000Z',
}

describe('finalizeRegistration', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('не создаёт пользователя из неполного draft', () => {
    const testStore = createTestStore()

    testStore.dispatch(
      updateStep1Draft({
        email: 'user@example.com',
        password: 'Password1!',
      }),
    )

    const result = testStore.dispatch(finalizeRegistration())

    expect(result).toBeNull()
    expect(testStore.getState().users.localUser).toBeNull()
    expect(testStore.getState().auth.session).toBeNull()
    expect(storageService.get(STORAGE_KEYS.LOCAL_USER)).toBeNull()
  })

  it('создаёт пользователя, активирует сессию и очищает старые данные', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-09T12:00:00.000Z'))

    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000001',
    )

    const testStore = createTestStore()

    // Имитируем данные предыдущего локального пользователя.
    testStore.dispatch(setLocalUser(oldLocalUser))
    testStore.dispatch(addFavorite('favorite-user-id'))
    testStore.dispatch(
      addRequest({
        id: 'old-request-id',
        fromUserId: oldLocalUser.id,
        toUserId: 'another-user-id',
        createdAt: '2026-01-01T00:00:00.000Z',
      }),
    )
    testStore.dispatch(addNotification('old-request-id'))

    storageService.set(STORAGE_KEYS.LOCAL_USER, oldLocalUser)
    storageService.set(STORAGE_KEYS.REQUESTS, [{ id: 'old-request-id' }])
    storageService.set(STORAGE_KEYS.NOTIFICATIONS, [{ requestId: 'old-request-id', isRead: false }])

    // Заполняем draft данными всех трёх шагов.
    testStore.dispatch(
      updateStep1Draft({
        email: 'new-user@example.com',
        password: 'Password1!',
      }),
    )

    testStore.dispatch(
      updateStep2Draft({
        name: 'Новый пользователь',
        birthDate: '1993-04-15',
        gender: 'preferNotToSay',
        cityId: 'saint-petersburg',
        avatarUrl: null,
        learningSubcategoryIds: ['english'],
      }),
    )

    testStore.dispatch(
      updateStep3Draft({
        offeredSkill: {
          title: 'Видеомонтаж',
          categoryId: 'creativity-art',
          subcategoryId: 'video-editing',
          description: 'Научу основам видеомонтажа',
          imageUrls: ['data:image/png;base64,dGVzdA=='],
        },
      }),
    )

    const result = testStore.dispatch(finalizeRegistration())

    const expectedUser: User = {
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Новый пользователь',
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

    const expectedAccount: AuthAccount = {
      userId: expectedUser.id,
      email: 'new-user@example.com',
      password: 'Password1!',
    }

    const expectedSession: AuthSession = {
      userId: expectedUser.id,
    }

    const state = testStore.getState()

    expect(result).toEqual(expectedUser)

    // Новый пользователь хранится отдельно и не дублируется
    // среди моковых пользователей.
    expect(state.users.localUser).toEqual(expectedUser)
    expect(state.users.mockUsers).toEqual([])

    expect(state.auth.account).toEqual(expectedAccount)
    expect(state.auth.session).toEqual(expectedSession)
    expect(state.auth.status).toBe('succeeded')

    expect(state.favorites.favoriteUserIds).toEqual([])
    expect(state.requests.items).toEqual([])
    expect(state.notifications.items).toEqual([])
    expect(state.registration.draft).toEqual({})

    expect(storageService.get<User>(STORAGE_KEYS.LOCAL_USER)).toEqual(expectedUser)
    expect(storageService.get<AuthAccount>(STORAGE_KEYS.AUTH_ACCOUNT)).toEqual(expectedAccount)
    expect(storageService.get<AuthSession>(STORAGE_KEYS.AUTH_SESSION)).toEqual(expectedSession)

    expect(storageService.get(STORAGE_KEYS.FAVORITES)).toBeNull()
    expect(storageService.get(STORAGE_KEYS.REQUESTS)).toBeNull()
    expect(storageService.get(STORAGE_KEYS.NOTIFICATIONS)).toBeNull()
  })
})
