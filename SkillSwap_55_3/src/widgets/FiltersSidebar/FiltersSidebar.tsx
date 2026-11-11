import { useState } from 'react'
import clsx from 'clsx'

import type {
  CatalogFilters,
  CatalogGender,
  CatalogOfferType,
  Category,
  City,
} from '@/shared/types'
import { Checkbox } from '@/shared/ui/Checkbox'
import { RadioButton } from '@/shared/ui/RadioButton'
import ChevronDownIcon from '@/shared/assets/icons/icon-chevron-down.svg?react'
import { FilterCategoryGroup } from '@/widgets/FilterCategoryGroup'

import styles from './FiltersSidebar.module.css'

export interface FiltersSidebarProps {
  categories: Category[]
  cities: City[]
  filters: CatalogFilters
  onChange: (filters: CatalogFilters) => void
  className?: string
}

export const EMPTY_CATALOG_FILTERS: CatalogFilters = {
  offerType: 'all',
  gender: 'all',
  subcategoryIds: [],
  cityIds: [],
}

const OFFER_TYPES: Array<{
  value: CatalogOfferType
  label: string
}> = [
  { value: 'all', label: 'Всё' },
  { value: 'learning', label: 'Хочу научиться' },
  { value: 'teaching', label: 'Могу научить' },
]

const GENDERS: Array<{
  value: CatalogGender
  label: string
}> = [
  { value: 'all', label: 'Не имеет значения' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

const VISIBLE_CITIES_COUNT = 5

// Добавляет или удаляет идентификатор из выбранного списка.
function toggleId(ids: string[], id: string, checked: boolean): string[] {
  if (checked) {
    return ids.includes(id) ? ids : [...ids, id]
  }

  return ids.filter((currentId) => currentId !== id)
}

export function FiltersSidebar({
  categories,
  cities,
  filters,
  onChange,
  className,
}: FiltersSidebarProps) {
  // Управляет отображением полного списка городов.
  const [showAllCities, setShowAllCities] = useState(false)

  // Показывает первые пять городов или весь переданный список.
  const visibleCities = showAllCities ? cities : cities.slice(0, VISIBLE_CITIES_COUNT)

  // Обновляет выбранный тип предложения.
  const handleOfferTypeChange = (offerType: CatalogOfferType) => {
    onChange({
      ...filters,
      offerType,
    })
  }

  // Обновляет выбранный пол автора.
  const handleGenderChange = (gender: CatalogGender) => {
    onChange({
      ...filters,
      gender,
    })
  }

  // Обновляет выбранные подкатегории одной категории.
  const handleSubcategoriesChange = (category: Category, checkedSubcategoryIds: string[]) => {
    const categorySubcategoryIds = category.subcategories.map(({ id }) => id)

    const otherSubcategoryIds = filters.subcategoryIds.filter(
      (id) => !categorySubcategoryIds.includes(id),
    )

    onChange({
      ...filters,
      subcategoryIds: [...otherSubcategoryIds, ...checkedSubcategoryIds],
    })
  }

  // Добавляет или удаляет выбранный город.
  const handleCityChange = (cityId: string, checked: boolean) => {
    onChange({
      ...filters,
      cityIds: toggleId(filters.cityIds, cityId, checked),
    })
  }

  return (
    <aside className={clsx(styles.sidebar, className)}>
      <div className={styles.group}>
        {OFFER_TYPES.map(({ value, label }) => (
          <RadioButton
            key={value}
            name="offerType"
            label={label}
            checked={filters.offerType === value}
            onChange={() => handleOfferTypeChange(value)}
          />
        ))}
      </div>

      <section className={styles.section}>
        <h3 className={styles.heading}>Навыки</h3>

        <div className={styles.categories}>
          {categories.map((category) => (
            <FilterCategoryGroup
              key={category.id}
              category={category.name}
              subcategories={category.subcategories}
              checkedSubcategoryIds={category.subcategories
                .map(({ id }) => id)
                .filter((id) => filters.subcategoryIds.includes(id))}
              onChange={(checkedSubcategoryIds) =>
                handleSubcategoriesChange(category, checkedSubcategoryIds)
              }
            />
          ))}
        </div>

        <button type="button" className={styles.showMore}>
          Все категории
          <ChevronDownIcon className={styles.showMoreIcon} aria-hidden="true" />
        </button>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Пол автора</h3>

        <div className={styles.group}>
          {GENDERS.map(({ value, label }) => (
            <RadioButton
              key={value}
              name="gender"
              label={label}
              checked={filters.gender === value}
              onChange={() => handleGenderChange(value)}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.heading}>Город</h3>

        <div className={styles.group}>
          {visibleCities.map(({ id, name }) => (
            <Checkbox
              key={id}
              label={name}
              checked={filters.cityIds.includes(id)}
              onChange={(event) => handleCityChange(id, event.target.checked)}
              className={styles.cityCheckbox}
            />
          ))}
        </div>

        {cities.length > VISIBLE_CITIES_COUNT && (
          <button
            type="button"
            className={styles.showMore}
            onClick={() => setShowAllCities((currentValue) => !currentValue)}
            aria-expanded={showAllCities}
          >
            {showAllCities ? 'Скрыть' : 'Все города'}

            <ChevronDownIcon
              className={clsx(styles.showMoreIcon, showAllCities && styles.showMoreIconExpanded)}
              aria-hidden="true"
            />
          </button>
        )}
      </section>
    </aside>
  )
}
