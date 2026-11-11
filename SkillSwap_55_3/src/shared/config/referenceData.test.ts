import { describe, expect, it } from 'vitest'

import { categories, cities } from './referenceData'

describe('статические справочники', () => {
  it('содержит все категории и подкатегории', () => {
    const subcategories = categories.flatMap((category) => category.subcategories)

    expect(categories).toHaveLength(6)
    expect(subcategories).toHaveLength(42)
  })

  it('не содержит повторяющихся идентификаторов', () => {
    const categoryIds = categories.map((category) => category.id)
    const subcategoryIds = categories.flatMap((category) =>
      category.subcategories.map((subcategory) => subcategory.id),
    )
    const cityIds = cities.map((city) => city.id)

    expect(new Set(categoryIds).size).toBe(categoryIds.length)
    expect(new Set(subcategoryIds).size).toBe(subcategoryIds.length)
    expect(new Set(cityIds).size).toBe(cityIds.length)
  })

  it('содержит подкатегории, ранее отсутствовавшие в каталоге', () => {
    const subcategoryIds = categories.flatMap((category) =>
      category.subcategories.map((subcategory) => subcategory.id),
    )

    expect(subcategoryIds).toEqual(
      expect.arrayContaining([
        'japanese',
        'chinese',
        'acting',
        'creative-writing',
        'art-therapy',
        'decor-diy',
        'coaching',
        'teaching-skills',
        'physical-training',
        'sleep-recovery',
        'work-life-balance',
      ]),
    )
  })

  it('содержит полный список городов', () => {
    const cityIds = cities.map((city) => city.id)

    expect(cities.length).toBeGreaterThanOrEqual(15)
    expect(cityIds).toEqual(
      expect.arrayContaining(['moscow', 'saint-petersburg', 'volgograd', 'chelyabinsk']),
    )
  })
})
