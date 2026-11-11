import { useState, type ChangeEvent } from 'react'
import clsx from 'clsx'

import type { Subcategory } from '@/shared/types'
import { Checkbox } from '@/shared/ui/Checkbox'
import chevronDown from '@/shared/assets/icons/icon-chevron-down.svg'

import styles from './FilterCategoryGroup.module.css'

export interface FilterCategoryGroupProps {
  category: string
  subcategories: Subcategory[]
  checkedSubcategoryIds: string[]
  onChange: (subcategoryIds: string[]) => void
}

export const FilterCategoryGroup = ({
  category,
  subcategories,
  checkedSubcategoryIds,
  onChange,
}: FilterCategoryGroupProps) => {
  const [isOpen, setIsOpen] = useState(false)

  // Определяет состояние родительского чекбокса.
  const checkedCount = checkedSubcategoryIds.length
  const isAllChecked = subcategories.length > 0 && checkedCount === subcategories.length
  const isIndeterminate = checkedCount > 0 && !isAllChecked

  // Добавляет или удаляет идентификатор выбранной подкатегории.
  const handleSubcategoryChange = (subcategoryId: string, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onChange([...checkedSubcategoryIds, subcategoryId])
      return
    }

    onChange(checkedSubcategoryIds.filter((id) => id !== subcategoryId))
  }

  // Выбирает или сбрасывает все подкатегории текущей категории.
  const handleParentChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onChange(subcategories.map(({ id }) => id))
      return
    }

    onChange([])
  }

  return (
    <section className={styles['filter-category-group__sidebar']}>
      <header className={styles['filter-category-group__header']}>
        <div
          className={styles['filter-category-group__header-title']}
          onClick={() => setIsOpen((previousValue) => !previousValue)}
        >
          <div
            className={styles['filter-category-group__header-checkbox']}
            onClick={(event) => event.stopPropagation()}
          >
            <Checkbox
              label=""
              checked={isAllChecked}
              indeterminate={isIndeterminate}
              onChange={handleParentChange}
            />
          </div>

          <p className={styles['filter-category-group__header-text']}>{category}</p>

          <span
            className={clsx(
              styles['filter-category-group__header-icon'],
              isOpen && styles['is-open'],
            )}
          >
            <img src={chevronDown} alt="" aria-hidden="true" />
          </span>
        </div>
      </header>

      {isOpen && (
        <div className={styles['filter-category-group__subcategories-wrapper']}>
          <section className={styles['filter-category-group__subcategories-list']}>
            {subcategories.map(({ id, name }) => (
              <Checkbox
                key={id}
                label={name}
                checked={checkedSubcategoryIds.includes(id)}
                onChange={(event) => handleSubcategoryChange(id, event)}
                className={styles['filter-category-group__subcategories-item']}
              />
            ))}
          </section>
        </div>
      )}
    </section>
  )
}
