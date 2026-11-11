import { forwardRef, InputHTMLAttributes, ReactNode, useId, useState } from 'react'
import styles from './Input.module.css'
import clsx from 'clsx'


type HelperTextTone = 'default' | 'success'

type BaseInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className' | 'value' | 'defaultValue'
> & {
  label?: string
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  error?: string
  helperText?: string
  helperTextTone?: HelperTextTone
  className?: string

  // Дополнительный класс для внутренней обёртки поля ввода.
  wrapperClassName?: string

  // Иконка слева от поля ввода.
  icon?: ReactNode

  // Контент справа; для password используются отдельные иконки.
  trailingIcon?: ReactNode

  showPasswordIcon?: ReactNode
  hidePasswordIcon?: ReactNode

  borderless?: boolean
}

// Controlled и uncontrolled режимы не могут использоваться одновременно.
type ControlledInputProps = {
  value: string
  defaultValue?: never
}

type UncontrolledInputProps = {
  value?: never
  defaultValue?: string
}

export type InputProps = BaseInputProps & (ControlledInputProps | UncontrolledInputProps)

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = 'text',
      error,
      helperText,
      helperTextTone,
      className,
      wrapperClassName,
      disabled,
      icon,
      trailingIcon,
      value,
      defaultValue,
      showPasswordIcon,
      hidePasswordIcon,
      borderless,
      id,
      ...inputProps
    },
    ref,
  ) => {
    // Используем переданный id или генерируем стабильный для связи с label.
    const generatedId = useId()
    const inputId = id ?? generatedId

    // Управляем видимостью значения только для поля пароля.
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword && isPasswordVisible ? 'text' : type

    return (
      <div className={clsx(styles['input-container'], className)}>
        {label && (
          <label className={styles['input-label']} htmlFor={inputId}>
            {label}
          </label>
        )}

        <div
          className={clsx(
            styles['input-wrapper'],
            wrapperClassName,
            borderless && styles.borderless,
            error && styles.error,
            disabled && styles.disabled,
          )}
        >
          {icon && (
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
          )}

          {/* Передаём нативные атрибуты и ref непосредственно HTMLInputElement. */}
          <input
            {...inputProps}
            ref={ref}
            id={inputId}
            className={styles.input}
            type={inputType}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
          />

          {isPassword ? (
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              disabled={disabled}
              aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
              className={styles['password-button']}
            >
              {isPasswordVisible ? hidePasswordIcon : showPasswordIcon}
            </button>
          ) : (
            trailingIcon && <span className={styles['trailing-icon']}>{trailingIcon}</span>
          )}
        </div>

        {/* Ошибка имеет приоритет над вспомогательным текстом. */}
        {error ? (
          <span className={styles['error-text']}>{error}</span>
        ) : (
          helperText && (
            <span
              className={clsx(
                styles['helper-text'],
                helperTextTone === 'success' && styles['helper-text-success'],
              )}
            >
              {helperText}
            </span>
          )
        )}
      </div>
    )
  },
)

// Задаём имя компонента для корректного отображения в React DevTools.
Input.displayName = 'Input'
