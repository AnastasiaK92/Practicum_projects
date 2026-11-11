import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AppDispatch, RootState } from '@/store'

export interface FavoritesState {
  favoriteUserIds: string[]
}

// Восстанавливает избранное при создании Redux-store или задает пустой массив, как первоначальное состояние.
const getInitialState = (): FavoritesState => ({
  favoriteUserIds: storageService.get<string[]>(STORAGE_KEYS.FAVORITES) ?? [],
})

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: getInitialState,
  reducers: {
    // Добавляет пользователя в начало списка избранного.
    addFavoriteToState(state, action: PayloadAction<string>) {
      if (!state.favoriteUserIds.includes(action.payload)) {
        state.favoriteUserIds.unshift(action.payload)
      }
    },

    // Удаляет пользователя из списка избранного.
    removeFavoriteFromState(state, action: PayloadAction<string>) {
      state.favoriteUserIds = state.favoriteUserIds.filter(
        (userId) => userId !== action.payload,
      )
    },

    // Заменяет список данными из browser storage.
    setFavoritesFromStorage(state, action: PayloadAction<string[]>) {
      state.favoriteUserIds = action.payload
    },

    // Очищает только активное состояние Redux.
    clearFavorites(state) {
      state.favoriteUserIds = []
    },
  },
})

const {
  addFavoriteToState,
  removeFavoriteFromState,
  setFavoritesFromStorage,
  clearFavorites,
} = favoritesSlice.actions

// Добавляет пользователя в Redux и сохраняет новый список в localStorage.
export const addFavorite =
  (userId: string) =>
  (dispatch: AppDispatch, getState: () => RootState): boolean => {
    const state = getState()
    const currentUserId = state.auth.session?.userId
    const favoriteUserIds = state.favorites.favoriteUserIds

    // Запрещает добавлять себя или повторно добавлять существующий id.
    if (userId === currentUserId || favoriteUserIds.includes(userId)) {
      return false
    }

    const updatedFavoriteUserIds = [userId, ...favoriteUserIds]
    const isSaved = storageService.set(STORAGE_KEYS.FAVORITES, updatedFavoriteUserIds)

    if (!isSaved) {
      return false
    }

    dispatch(addFavoriteToState(userId))

    return true
  }

// Удаляет пользователя из Redux и сохраняет новый список в localStorage.
export const removeFavorite =
  (userId: string) =>
  (dispatch: AppDispatch, getState: () => RootState): boolean => {
    const favoriteUserIds = getState().favorites.favoriteUserIds

    if (!favoriteUserIds.includes(userId)) {
      return false
    }

    const updatedFavoriteUserIds = favoriteUserIds.filter(
      (favoriteUserId) => favoriteUserId !== userId,
    )
    const isSaved = storageService.set(STORAGE_KEYS.FAVORITES, updatedFavoriteUserIds)

    if (!isSaved) {
      return false
    }

    dispatch(removeFavoriteFromState(userId))

    return true
  }

// Восстанавливает избранное после повторного входа пользователя.
export const restoreFavorites =
  () =>
  (dispatch: AppDispatch): void => {
    const favoriteUserIds = storageService.get<string[]>(STORAGE_KEYS.FAVORITES) ?? []

    dispatch(setFavoritesFromStorage(favoriteUserIds))
  }

// Возвращает список идентификаторов избранных пользователей.
export const selectFavoriteUserIds = (state: RootState) => state.favorites.favoriteUserIds

export { clearFavorites }

export default favoritesSlice.reducer
