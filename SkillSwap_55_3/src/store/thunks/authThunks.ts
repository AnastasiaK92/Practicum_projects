import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AppDispatch } from '@/store'

import { clearAuthSession } from '@/store/slices/authSlice'
import { clearFavorites } from '@/store/slices/favoritesSlice'
import { resetRegistrationDraft } from '@/store/slices/registrationSlice'
import { resetCatalogFilters } from '@/store/slices/catalogFiltersSlice'

export const logout = () => (dispatch: AppDispatch) => {
  storageService.remove(STORAGE_KEYS.AUTH_SESSION)

  dispatch(clearAuthSession())
  dispatch(clearFavorites())
  dispatch(resetRegistrationDraft())
  dispatch(resetCatalogFilters())

  storageService.remove(STORAGE_KEYS.CATALOG_FILTERS, 'session')
  storageService.remove(STORAGE_KEYS.CATALOG_SORT, 'session')
}
