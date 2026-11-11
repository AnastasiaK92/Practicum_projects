import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './IconButton.module.css'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
}

export function IconButton({ icon, type = 'button', className, ...rest }: IconButtonProps) {
  return (
    <button type={type} className={clsx(styles.iconButton, className)} {...rest}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
