import CheckboxDoneIcon from '../../assets/icons/icon-checkbox-done.svg?react'
import CheckboxEmptyIcon from '../../assets/icons/icon-checkbox-empty.svg?react'
import CheckboxRemoveIcon from '../../assets/icons/icon-checkbox-remove.svg?react'
import { useEffect, useRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import styles from './Checkbox.module.css'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> & {
  label: string
  indeterminate?: boolean
  className?: string
}

export const Checkbox = ({
  label,
  indeterminate = false,
  className,
  ...inputProps
}: CheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <label className={`${styles.label} ${className ?? ''}`}>
      <input
        ref={inputRef}
        className={`visuallyHidden ${styles.input}`}
        type="checkbox"
        {...inputProps}
      />

      <span className={styles.control} aria-hidden="true">
        <CheckboxEmptyIcon className={`${styles.icon} ${styles.emptyIcon}`} />
        <CheckboxDoneIcon className={`${styles.icon} ${styles.doneIcon}`} />
        <CheckboxRemoveIcon className={`${styles.icon} ${styles.removeIcon}`} />
      </span>

      <span className={styles.labelText}>{label}</span>
    </label>
  )
}
