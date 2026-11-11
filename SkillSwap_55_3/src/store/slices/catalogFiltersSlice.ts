import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { CatalogFilters, CatalogSort } from '@/shared/types'

export interface CatalogFiltersState {
  filters: CatalogFilters
  sort: CatalogSort
}

// Значения фильтров и сортировки каталога по умолчанию.
export const defaultFilters: CatalogFilters = {
  offerType: 'all',
  gender: 'all',
  subcategoryIds: [],
  cityIds: [],
}
export const defaultSort: CatalogSort = 'default'

// Восстанавливает начальные фильтры и сортировку каталога из sessionStorage,
// чтобы они сохранялись при обновлении страницы и сбрасывались при закрытии вкладки.
const initialState: CatalogFiltersState = {
  filters:
    storageService.get<CatalogFilters>(STORAGE_KEYS.CATALOG_FILTERS, 'session') ?? defaultFilters,
  sort: storageService.get<CatalogSort>(STORAGE_KEYS.CATALOG_SORT, 'session') ?? defaultSort,
}

const catalogFiltersSlice = createSlice({
  name: 'catalogFilters',
  initialState,
  reducers: {
    setCatalogFilters(state, action: PayloadAction<CatalogFilters>) {
      state.filters = action.payload
    },
    setCatalogSort(state, action: PayloadAction<CatalogSort>) {
      state.sort = action.payload
    },
    resetCatalogFilters(state) {
      state.filters = defaultFilters
      state.sort = defaultSort
    },
  },
})

export const { setCatalogFilters, setCatalogSort, resetCatalogFilters } =
  catalogFiltersSlice.actions
export default catalogFiltersSlice.reducer
