import type { ReactNode } from 'react'
import clsx from 'clsx'

import CrossIcon from '../../assets/icons/icon-cross.svg?react'
import { IconButton } from '../IconButton'

import styles from './Toast.module.css'

export type ToastVariant = 'popup' | 'new' | 'read'

export type ToastProps = {
  variant: ToastVariant
  icon: ReactNode
  text: string
  description?: string
  dateTime?: string
  action?: ReactNode
  onClose?: () => void
  isVisible?: boolean
}

export const Toast = ({
  variant,
  icon,
  text,
  description,
  dateTime,
  action,
  onClose,
  isVisible = true,
}: ToastProps) => {
  const isPopup = variant === 'popup'
  const isRead = variant === 'read'

  return (
    <div
      className={clsx(
        styles.toast,
        styles[variant],
        isPopup && (isVisible ? styles.visible : styles.hidden),
      )}
    >
      <div className={styles.content}>
        <div className={styles.main}>
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>

          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
            {!isPopup && description && <p className={styles.description}>{description}</p>}
          </div>
        </div>

        {!isPopup && dateTime && <span className={styles.dateTime}>{dateTime}</span>}
      </div>

      {isPopup && (
        <IconButton
          className={styles.closeButton}
          icon={<CrossIcon />}
          onClick={onClose}
          aria-label="Закрыть уведомление"
        />
      )}

      {!isRead && action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
