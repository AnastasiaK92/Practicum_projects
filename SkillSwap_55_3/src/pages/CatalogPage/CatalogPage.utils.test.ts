import { describe, expect, it } from 'vitest'
import type { CatalogFilters } from '@/widgets/FiltersSidebar'
import { removeCatalogFilter } from './CatalogPage.utils'


describe('removeCatalogFilter', () => {
  it('удаляет только выбранный фильтр города', () => {
    const filters: CatalogFilters = {
      offerType: 'teaching',
      gender: 'female',
      subcategoryIds: ['cooking'],
      cityIds: ['moscow', 'saint-petersburg'],
    }

    const result = removeCatalogFilter(filters, 'city:moscow')

    expect(result).toEqual({
      offerType: 'teaching',
      gender: 'female',
      subcategoryIds: ['cooking'],
      cityIds: ['saint-petersburg'],
    })
  })
})
