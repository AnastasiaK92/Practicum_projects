import React from 'react';
import clsx from 'clsx';
import styles from './Toggle.module.css';

export interface ToggleProps {
  /** Включен ли переключатель */
  checked?: boolean;
  /** Колбэк при изменении состояния */
  onChange?: (checked: boolean) => void;
  /** Заблокирован ли переключатель */
  disabled?: boolean;
  /** Дополнительный CSS-класс */
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked = false,
  onChange,
  disabled = false,
  className,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked);
  };

  return (
    <label
      className={clsx(styles.toggle, className, {
        [styles.disabled]: disabled,
      })}
    >
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </label>
  );
};