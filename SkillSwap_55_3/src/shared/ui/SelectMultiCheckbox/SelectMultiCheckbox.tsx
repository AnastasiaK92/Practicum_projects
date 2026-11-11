import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'

import ChevronDownIcon from '../../assets/icons/icon-chevron-down.svg?react'
import ChevronUpIcon from '../../assets/icons/icon-chevron-up.svg?react'
import { Checkbox } from '../Checkbox'
import { DropdownContainer } from '../DropdownContainer'

import styles from './SelectMultiCheckbox.module.css'

export type SelectMultiCheckboxOption = {
  value: string
  label: string
}

export interface SelectMultiCheckboxProps {
  options: SelectMultiCheckboxOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
}

export function SelectMultiCheckbox({
  options,
  value,
  onChange,
  placeholder = 'Выберите значения',
  disabled = false,
  className,
  label,
}: SelectMultiCheckboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerId = useId()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }

  const handleCheckboxChange = (
    optionValue: string,
    checked: boolean,
  ) => {
    if (checked) {
      onChange([...value, optionValue])
      return
    }

    onChange(value.filter((item) => item !== optionValue))
  }

  const triggerText =
    value.length > 0
      ? `Выбрано: ${value.length}`
      : placeholder

  return (
    <div
      ref={rootRef}
      className={clsx(styles.container, className)}
    >
      {label && (
        <label
          className={styles.label}
          htmlFor={triggerId}
        >
          {label}
        </label>
      )}

      <button
        id={triggerId}
        type="button"
        className={clsx(styles.trigger, {
          [styles.triggerOpen]: isOpen,
          [styles.triggerDisabled]: disabled,
        })}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span
          className={clsx(styles.triggerText, {
            [styles.placeholder]: value.length === 0,
          })}
        >
          {triggerText}
        </span>

        <span className={styles.icon} aria-hidden="true">
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </span>
      </button>

      {isOpen && (
        <DropdownContainer className={styles.dropdown}>
          {options.length === 0 ? (
            <span className={styles.empty}>
              Нет доступных опций
            </span>
          ) : (
            <div className={styles.options}>
              {options.map((option) => (
                <Checkbox
                  key={option.value}
                  className={styles.checkbox}
                  label={option.label}
                  checked={value.includes(option.value)}
                  onChange={(event) =>
                    handleCheckboxChange(
                      option.value,
                      event.target.checked,
                    )
                  }
                />
              ))}
            </div>
          )}
        </DropdownContainer>
      )}
    </div>
  )
}
