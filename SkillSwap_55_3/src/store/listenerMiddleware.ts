import { createListenerMiddleware, isAnyOf, type TypedStartListening } from '@reduxjs/toolkit'
import { clearAuthSession } from '@/store/slices/authSlice'
import {
  resetCatalogFilters,
  setCatalogFilters,
  setCatalogSort,
} from '@/store/slices/catalogFiltersSlice'
import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AppDispatch, RootState } from '@/store'
import { clearFavorites } from './slices/favoritesSlice'
import { resetRegistrationDraft } from './slices/registrationSlice'

export const listenerMiddleware = createListenerMiddleware()

export type AppStartListening = TypedStartListening<RootState, AppDispatch>
const startAppListening = listenerMiddleware.startListening as AppStartListening

// Сохраняет фильтры и сортировку каталога в sessionStorage при каждом изменении.
startAppListening({
  matcher: isAnyOf(setCatalogFilters, setCatalogSort),
  effect: (_action, listenerApi) => {
    const { filters, sort } = listenerApi.getState().catalogFilters
    storageService.set(STORAGE_KEYS.CATALOG_FILTERS, filters, 'session')
    storageService.set(STORAGE_KEYS.CATALOG_SORT, sort, 'session')
  },
})

// Удаляет сохранённые фильтры и сортировку каталога из sessionStorage при сбросе.
startAppListening({
  actionCreator: resetCatalogFilters,
  effect: () => {
    storageService.remove(STORAGE_KEYS.CATALOG_FILTERS, 'session')
    storageService.remove(STORAGE_KEYS.CATALOG_SORT, 'session')
  },
})

// Сбрасывает фильтры каталога при завершении пользовательской сессии.
startAppListening({
  actionCreator: clearAuthSession,
  effect: (_action, listenerApi) => {
    storageService.remove(STORAGE_KEYS.AUTH_SESSION)
    listenerApi.dispatch(clearFavorites())
    listenerApi.dispatch(resetRegistrationDraft())
    listenerApi.dispatch(resetCatalogFilters())
  },
})
