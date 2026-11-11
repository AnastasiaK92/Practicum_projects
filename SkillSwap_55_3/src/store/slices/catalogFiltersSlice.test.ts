import { beforeEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '@/shared/lib/constants'
import type { CatalogFilters } from '@/shared/types'

describe('catalogFiltersSlice', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.resetModules()
  })

  it('использует значения по умолчанию, если в sessionStorage ничего не сохранено', async () => {
    const { default: reducer } = await import('./catalogFiltersSlice')
    const state = reducer(undefined, { type: '@@INIT' })

    expect(state).toEqual({
      filters: {
        offerType: 'all',
        gender: 'all',
        subcategoryIds: [],
        cityIds: [],
      },
      sort: 'default',
    })
  })

  it('восстанавливает фильтры и сортировку из sessionStorage при инициализации', async () => {
    const storedFilters: CatalogFilters = {
      offerType: 'teaching',
      gender: 'female',
      subcategoryIds: ['sub-1'],
      cityIds: ['city-1'],
    }
    window.sessionStorage.setItem(STORAGE_KEYS.CATALOG_FILTERS, JSON.stringify(storedFilters))
    window.sessionStorage.setItem(STORAGE_KEYS.CATALOG_SORT, JSON.stringify('newest'))

    const { default: reducer } = await import('./catalogFiltersSlice')
    const state = reducer(undefined, { type: '@@INIT' })

    expect(state).toEqual({ filters: storedFilters, sort: 'newest' })
  })

  it('setCatalogFilters заменяет текущие фильтры', async () => {
    const { default: reducer, setCatalogFilters } = await import('./catalogFiltersSlice')
    const newFilters: CatalogFilters = {
      offerType: 'learning',
      gender: 'all',
      subcategoryIds: ['sub-2'],
      cityIds: [],
    }
    const state = reducer(undefined, setCatalogFilters(newFilters))

    expect(state.filters).toEqual(newFilters)
  })

  it('setCatalogSort заменяет текущую сортировку', async () => {
    const { default: reducer, setCatalogSort } = await import('./catalogFiltersSlice')
    const state = reducer(undefined, setCatalogSort('newest'))

    expect(state.sort).toBe('newest')
  })

  it('resetCatalogFilters сбрасывает фильтры и сортировку к значениям по умолчанию', async () => {
    const { default: reducer, setCatalogFilters, setCatalogSort, resetCatalogFilters } =
      await import('./catalogFiltersSlice')

    const changedState = reducer(
      reducer(undefined, setCatalogSort('newest')),
      setCatalogFilters({
        offerType: 'teaching',
        gender: 'male',
        subcategoryIds: ['sub-3'],
        cityIds: ['city-2'],
      }),
    )
    const state = reducer(changedState, resetCatalogFilters())

    expect(state).toEqual({
      filters: {
        offerType: 'all',
        gender: 'all',
        subcategoryIds: [],
        cityIds: [],
      },
      sort: 'default',
    })
  })
})
