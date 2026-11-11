import React from 'react'
import styles from './Textarea.module.css'
import clsx from 'clsx'

interface TextareaProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
  helperText?: string
  disabled?: boolean
  className?: string
}

export const Textarea = (props: TextareaProps) => {
  const { label, placeholder, value, onChange, error, helperText, disabled, className } = props

  return (
    <div className={clsx(styles['textarea-container'], className)}>
      {label && <label className={styles['textarea-label']}>{label}</label>}

      <div
        className={clsx(
          styles['textarea-wrapper'],
          error && styles.error,
          disabled && styles.disabled,
        )}
      >
        <textarea
          className={styles.textarea}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          value={value}
        />
      </div>

      {error ? (
        <span className={styles['textarea-error']}>{error}</span>
      ) : (
        helperText && <span className={styles['textarea-helperText']}>{helperText}</span>
      )}
    </div>
  )
}
