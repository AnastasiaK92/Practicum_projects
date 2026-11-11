import { beforeEach, describe, expect, it, vi } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import { store } from '@/store'
import { clearAuthSession, setAuthSession } from './authSlice'
import favoritesReducer, {
  addFavorite,
  clearFavorites,
  removeFavorite,
  restoreFavorites,
  selectFavoriteUserIds,
} from './favoritesSlice'

beforeEach(() => {
  vi.restoreAllMocks()
  storageService.remove(STORAGE_KEYS.FAVORITES)
  store.dispatch(clearFavorites())
  store.dispatch(clearAuthSession())
})

describe('favoritesSlice', () => {
  it('восстанавливает избранное из localStorage при инициализации', () => {
    storageService.set(STORAGE_KEYS.FAVORITES, ['user-001', 'user-002'])

    const state = favoritesReducer(undefined, { type: 'unknown' })

    expect(state.favoriteUserIds).toEqual(['user-001', 'user-002'])
  })

  it('добавляет нового пользователя в начало списка', () => {
    store.dispatch(addFavorite('user-001'))
    const result = store.dispatch(addFavorite('user-002'))

    expect(result).toBe(true)
    expect(store.getState().favorites.favoriteUserIds).toEqual(['user-002', 'user-001'])
    expect(storageService.get<string[]>(STORAGE_KEYS.FAVORITES)).toEqual([
      'user-002',
      'user-001',
    ])
  })

  it('не добавляет пользователя повторно', () => {
    const firstResult = store.dispatch(addFavorite('user-001'))
    const secondResult = store.dispatch(addFavorite('user-001'))

    expect(firstResult).toBe(true)
    expect(secondResult).toBe(false)
    expect(store.getState().favorites.favoriteUserIds).toEqual(['user-001'])
    expect(storageService.get<string[]>(STORAGE_KEYS.FAVORITES)).toEqual(['user-001'])
  })

  it('не позволяет добавить текущего пользователя в избранное', () => {
    store.dispatch(setAuthSession({ userId: 'local-user' }))

    const result = store.dispatch(addFavorite('local-user'))

    expect(result).toBe(false)
    expect(store.getState().favorites.favoriteUserIds).toEqual([])
    expect(storageService.get(STORAGE_KEYS.FAVORITES)).toBeNull()
  })

  it('удаляет пользователя из Redux и localStorage', () => {
    store.dispatch(addFavorite('user-001'))
    store.dispatch(addFavorite('user-002'))

    const result = store.dispatch(removeFavorite('user-002'))

    expect(result).toBe(true)
    expect(store.getState().favorites.favoriteUserIds).toEqual(['user-001'])
    expect(storageService.get<string[]>(STORAGE_KEYS.FAVORITES)).toEqual(['user-001'])
  })

  it('не изменяет состояние при удалении отсутствующего пользователя', () => {
    const result = store.dispatch(removeFavorite('unknown-user'))

    expect(result).toBe(false)
    expect(store.getState().favorites.favoriteUserIds).toEqual([])
    expect(storageService.get(STORAGE_KEYS.FAVORITES)).toBeNull()
  })

  it('при logout очищает Redux, но сохраняет данные в localStorage', () => {
    store.dispatch(addFavorite('user-001'))

    store.dispatch(clearFavorites())

    expect(store.getState().favorites.favoriteUserIds).toEqual([])
    expect(storageService.get<string[]>(STORAGE_KEYS.FAVORITES)).toEqual(['user-001'])
  })

  it('восстанавливает сохранённое избранное после повторного login', () => {
    storageService.set(STORAGE_KEYS.FAVORITES, ['user-001', 'user-002'])

    store.dispatch(restoreFavorites())

    expect(store.getState().favorites.favoriteUserIds).toEqual(['user-001', 'user-002'])
  })

  it('не изменяет Redux, если добавление не сохранилось в localStorage', () => {
    vi.spyOn(storageService, 'set').mockReturnValue(false)

    const result = store.dispatch(addFavorite('user-001'))

    expect(result).toBe(false)
    expect(store.getState().favorites.favoriteUserIds).toEqual([])
  })

  it('не удаляет пользователя из Redux при ошибке записи в localStorage', () => {
    store.dispatch(addFavorite('user-001'))
    vi.spyOn(storageService, 'set').mockReturnValue(false)

    const result = store.dispatch(removeFavorite('user-001'))

    expect(result).toBe(false)
    expect(store.getState().favorites.favoriteUserIds).toEqual(['user-001'])
    expect(storageService.get<string[]>(STORAGE_KEYS.FAVORITES)).toEqual(['user-001'])
  })

  it('возвращает список избранных пользователей через селектор', () => {
    store.dispatch(addFavorite('user-001'))

    expect(selectFavoriteUserIds(store.getState())).toEqual(['user-001'])
  })
})
