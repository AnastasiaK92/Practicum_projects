import { beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import { store } from '@/store'

import { clearAuthSession, setAuthSession } from '@/store/slices/authSlice'

import { addFavorite, clearFavorites, restoreFavorites } from '@/store/slices/favoritesSlice'

import { resetRegistrationDraft, updateStep1Draft } from '@/store/slices/registrationSlice'

import { setCatalogFilters, setCatalogSort } from '@/store/slices/catalogFiltersSlice'

import { setLocalUser } from '@/store/slices/usersSlice'

// ИЗМЕНЕНО: добавлен тип User,
// чтобы gender проверялся как Gender, а не как обычный string.
import type { User } from '@/shared/types'

import { logout } from './authThunks'

describe('logout', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()

    store.dispatch(clearAuthSession())
    store.dispatch(clearFavorites())
    store.dispatch(resetRegistrationDraft())

    vi.restoreAllMocks()
  })

  it('удаляет AuthSession из localStorage', () => {
    const session = {
      userId: 'user-001',
    }

    storageService.set(STORAGE_KEYS.AUTH_SESSION, session)

    store.dispatch(setAuthSession(session))

    expect(storageService.get(STORAGE_KEYS.AUTH_SESSION)).toEqual(session)

    store.dispatch(logout())

    expect(storageService.get(STORAGE_KEYS.AUTH_SESSION)).toBeNull()
  })

  it('очищает AuthSession из Redux', () => {
    store.dispatch(
      setAuthSession({
        userId: 'user-001',
      }),
    )

    expect(store.getState().auth.session).toEqual({
      userId: 'user-001',
    })

    store.dispatch(logout())

    expect(store.getState().auth.session).toBeNull()
  })

  it('очищает Favorites только из Redux, но сохраняет localStorage', () => {
    store.dispatch(addFavorite('user-001'))
    store.dispatch(addFavorite('user-002'))

    expect(store.getState().favorites.favoriteUserIds).toEqual(['user-002', 'user-001'])

    expect(storageService.get<string[]>(STORAGE_KEYS.FAVORITES)).toEqual(['user-002', 'user-001'])

    store.dispatch(logout())

    expect(store.getState().favorites.favoriteUserIds).toEqual([])

    expect(storageService.get<string[]>(STORAGE_KEYS.FAVORITES)).toEqual(['user-002', 'user-001'])
  })

  it('очищает registration draft', () => {
    store.dispatch(
      updateStep1Draft({
        email: 'user@example.com',
        password: 'Password1!',
      }),
    )

    expect(store.getState().registration.draft).toEqual({
      email: 'user@example.com',
      password: 'Password1!',
    })

    store.dispatch(logout())

    expect(store.getState().registration.draft).toEqual({})
  })

  it('сбрасывает catalog filters и sort', () => {
    store.dispatch(
      setCatalogFilters({
        // ИЗМЕНЕНО:
        // categoryId и cityId отсутствуют в CatalogFilters.
        // Используем реальные поля из catalogFiltersSlice.
        offerType: 'all',
        gender: 'all',
        subcategoryIds: ['video-editing'],
        cityIds: ['saint-petersburg'],
      }),
    )

    store.dispatch(setCatalogSort('newest'))

    expect(store.getState().catalogFilters.filters).toEqual({
      offerType: 'all',
      gender: 'all',
      subcategoryIds: ['video-editing'],
      cityIds: ['saint-petersburg'],
    })

    expect(store.getState().catalogFilters.sort).toBe('newest')

    store.dispatch(logout())

    // ИЗМЕНЕНО:
    // Проверяем конкретно состояние defaultFilters,
    // а не expect.anything().
    expect(store.getState().catalogFilters.filters).toEqual({
      offerType: 'all',
      gender: 'all',
      subcategoryIds: [],
      cityIds: [],
    })

    expect(store.getState().catalogFilters.sort).toBe('default')
  })

  it('удаляет catalog filters и sort из sessionStorage', () => {
    // ИЗМЕНЕНО:
    // В sessionStorage теперь записываем объект,
    // соответствующий реальному типу CatalogFilters.
    storageService.set(
      STORAGE_KEYS.CATALOG_FILTERS,
      {
        offerType: 'all',
        gender: 'all',
        subcategoryIds: ['video-editing'],
        cityIds: ['saint-petersburg'],
      },
      'session',
    )

    storageService.set(STORAGE_KEYS.CATALOG_SORT, 'newest', 'session')

    expect(storageService.get(STORAGE_KEYS.CATALOG_FILTERS, 'session')).not.toBeNull()

    expect(storageService.get(STORAGE_KEYS.CATALOG_SORT, 'session')).toBe('newest')

    store.dispatch(logout())

    expect(storageService.get(STORAGE_KEYS.CATALOG_FILTERS, 'session')).toBeNull()

    expect(storageService.get(STORAGE_KEYS.CATALOG_SORT, 'session')).toBeNull()
  })

  it('не очищает users slice при logout', () => {
    // ИЗМЕНЕНО:
    // Явно указываем User, чтобы gender проверялся
    // как Gender, а не расширялся до string.
    const user: User = {
      id: 'user-001',
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
        description: 'Научу видеомонтажу',
        imageUrls: [],
      },
      learningSubcategoryIds: ['english'],
      likesCount: 10,
      createdAt: '2026-09-09T12:00:00.000Z',
    }

    store.dispatch(setLocalUser(user))

    expect(store.getState().users.localUser).toEqual(user)

    store.dispatch(logout())

    // Главное требование:
    // users slice НЕ должен очищаться при logout.
    expect(store.getState().users.localUser).toEqual(user)
  })

  it('после logout сохранённые Favorites можно восстановить при login', () => {
    store.dispatch(addFavorite('user-001'))
    store.dispatch(addFavorite('user-002'))

    store.dispatch(logout())

    expect(store.getState().favorites.favoriteUserIds).toEqual([])

    store.dispatch(
      setAuthSession({
        userId: 'user-001',
      }),
    )

    store.dispatch(restoreFavorites())

    expect(store.getState().favorites.favoriteUserIds).toEqual(['user-002', 'user-001'])
  })
})
