import { useState } from 'react'

import { Input } from '@/shared/ui/Input'
import type { InputProps } from '@/shared/ui/Input'

import iconSearch from '@/shared/assets/icons/icon-search.svg'
import iconCross from '@/shared/assets/icons/icon-cross.svg'

import styles from './SearchInput.module.css'

export interface SearchInputProps extends Pick<
  InputProps,
  'disabled' | 'className' | 'wrapperClassName' | 'error' | 'helperText' | 'borderless'
> {
  value?: string
  onValueChange?: (value: string) => void
  /** По умолчанию — текст плейсхолдера из макета. */
  placeholder?: string
}

/**
 * SearchInput может работать самостоятельно или получать значение от родителя.
 * Внешнее управление используется каталогом, где поисковый запрос хранится
 * локально на уровне страницы.
 */
export function SearchInput({
  placeholder = 'Искать навык',
  value,
  onValueChange,
  ...rest
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState('')

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleValueChange = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  return (
    <Input
      {...rest}
      type="search"
      aria-label="Поиск по навыкам"
      placeholder={placeholder}
      value={currentValue}
      onChange={(event) => handleValueChange(event.target.value)}
      icon={<img src={iconSearch} alt="" />}
      trailingIcon={
        currentValue ? (
          <button
            type="button"
            onClick={() => handleValueChange('')}
            aria-label="Очистить поле поиска"
            className={styles['clear-button']}
          >
            <img src={iconCross} alt="" />
          </button>
        ) : undefined
      }
    />
  )
}
