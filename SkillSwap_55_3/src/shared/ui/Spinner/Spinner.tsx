import React from 'react'
import styles from './Spinner.module.css'

export interface SpinnerProps {
  size?: number
  className?: string
  label?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  className = '',
  label = 'Загрузка...',
}) => {
  return (
    <div
      className={`${styles.spinner} ${className}`}
      style={{ '--spinner-size': `${size}px` } as React.CSSProperties}
      role="status"
      aria-label={label}
    />
  )
}
