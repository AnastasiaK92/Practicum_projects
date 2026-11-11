import type { ReactNode, MouseEventHandler } from 'react'
import clsx from 'clsx'

import styles from './SidebarItem.module.css'

export interface SidebarItemProps {
  /** Иконка пункта меню. */
  icon: ReactNode
  /** Название пункта меню. */
  label: string
  /** Активное (выбранное) состояние. */
  isActive?: boolean
  /** Клик по пункту. Роутинг реализуется снаружи, компонент его не содержит. */
  onClick?: MouseEventHandler<HTMLButtonElement>
}

/**
 * SidebarItem (VERST-61) — базовый пункт бокового меню профиля.
 * Не содержит логики роутинга — только визуальное представление и клик.
 */
export function SidebarItem({ icon, label, isActive = false, onClick }: SidebarItemProps) {
  return (
    <button
      type="button"
      className={clsx(styles.item, { [styles.active]: isActive })}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.label}>{label}</span>
    </button>
  )
}
