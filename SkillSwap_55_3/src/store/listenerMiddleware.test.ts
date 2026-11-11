import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '@/shared/lib/constants'
import authReducer, { clearAuthSession } from '@/store/slices/authSlice'
import catalogFiltersReducer, {
  setCatalogFilters,
  setCatalogSort,
} from '@/store/slices/catalogFiltersSlice'
import { listenerMiddleware } from './listenerMiddleware'

const buildTestStore = () => {
  const rootReducer = combineReducers({
    auth: authReducer,
    catalogFilters: catalogFiltersReducer,
  })
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  })
}

describe('listenerMiddleware (catalogFilters sessionStorage sync)', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('сохраняет фильтры в sessionStorage при setCatalogFilters', async () => {
    const store = buildTestStore()
    const newFilters = {
      offerType: 'teaching' as const,
      gender: 'all' as const,
      subcategoryIds: ['sub-1'],
      cityIds: [],
    }

    store.dispatch(setCatalogFilters(newFilters))

    await vi.waitFor(() => {
      expect(JSON.parse(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_FILTERS) ?? 'null')).toEqual(
        newFilters,
      )
    })
  })

  it('сохраняет сортировку в sessionStorage при setCatalogSort', async () => {
    const store = buildTestStore()

    store.dispatch(setCatalogSort('newest'))

    await vi.waitFor(() => {
      expect(JSON.parse(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_SORT) ?? 'null')).toBe(
        'newest',
      )
    })
  })

  it('удаляет фильтры и сортировку из sessionStorage при resetCatalogFilters', async () => {
    const store = buildTestStore()
    store.dispatch(setCatalogFilters({ offerType: 'learning', gender: 'male', subcategoryIds: [], cityIds: ['c-1'] }))
    store.dispatch(setCatalogSort('newest'))
    await vi.waitFor(() => {
      expect(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_FILTERS)).not.toBeNull()
    })

    store.dispatch({ type: 'catalogFilters/resetCatalogFilters' })

    await vi.waitFor(() => {
      expect(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_FILTERS)).toBeNull()
      expect(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_SORT)).toBeNull()
    })
  })

  it('сбрасывает фильтры каталога при clearAuthSession', async () => {
    const store = buildTestStore()
    store.dispatch(setCatalogFilters({ offerType: 'teaching', gender: 'female', subcategoryIds: ['sub-2'], cityIds: [] }))
    store.dispatch(setCatalogSort('newest'))
    await vi.waitFor(() => {
      expect(store.getState().catalogFilters.sort).toBe('newest')
    })

    store.dispatch(clearAuthSession())

    await vi.waitFor(() => {
      expect(store.getState().catalogFilters).toEqual({
        filters: {
          offerType: 'all',
          gender: 'all',
          subcategoryIds: [],
          cityIds: [],
        },
        sort: 'default',
      })
      expect(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_FILTERS)).toBeNull()
      expect(window.sessionStorage.getItem(STORAGE_KEYS.CATALOG_SORT)).toBeNull()
    })
  })
})
