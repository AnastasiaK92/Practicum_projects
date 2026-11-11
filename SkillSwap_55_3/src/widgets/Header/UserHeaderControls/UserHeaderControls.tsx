import { useEffect, useRef, type MouseEventHandler } from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import { Avatar } from '@/shared/ui/Avatar'
import NotificationIcon from '../../../shared/assets/icons/icon-notification.svg?react'
import LikeIcon from '../../../shared/assets/icons/icon-like.svg?react'
import { ProfileMenuDropdown } from '../ProfileMenuDropdown'
import { NotificationsDropdown } from '../NotificationsDropdown'
import styles from './UserHeaderControls.module.css'

export interface UserHeaderControlsProps {
  userName: string
  avatarSrc: string
  isProfileMenuOpen?: boolean
  isNotificationsMenuOpen?: boolean
  onProfileClick?: MouseEventHandler<HTMLButtonElement>
  onProfileMenuClose?: () => void
  onLogout?: () => void
  onNotificationsClick?: MouseEventHandler<HTMLButtonElement>
  onNotificationsMenuClose?: () => void
  onFavoritesClick?: MouseEventHandler<HTMLButtonElement>
}

export const UserHeaderControls = ({
  userName,
  avatarSrc,
  isProfileMenuOpen = false,
  isNotificationsMenuOpen = false,
  onProfileClick,
  onProfileMenuClose,
  onNotificationsClick,
  onNotificationsMenuClose,
  onFavoritesClick,
  onLogout,
}: UserHeaderControlsProps) => {
  const notificationsRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Закрывает меню профиля при нажатии за пределами его области.
  useEffect(() => {
    if (!isProfileMenuOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        onProfileMenuClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileMenuOpen, onProfileMenuClose])

  // Закрывает уведомления при нажатии за пределами кнопки и дропдауна.
  useEffect(() => {
    if (!isNotificationsMenuOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        onNotificationsMenuClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isNotificationsMenuOpen, onNotificationsMenuClose])

  return (
    <div className={styles.controls}>
      <div className={styles.icons}>
        <div className={styles.notificationsWrapper} ref={notificationsRef}>
          <IconButton
            icon={<NotificationIcon />}
            onClick={onNotificationsClick}
            aria-label="Кнопка уведомлений"
            aria-expanded={isNotificationsMenuOpen}
          />

          {/* Показывает список уведомлений в открытом состоянии. */}
          {isNotificationsMenuOpen && (
            <div className={styles.notificationsDropdown}>
              <NotificationsDropdown />
            </div>
          )}
        </div>

        <IconButton icon={<LikeIcon />} onClick={onFavoritesClick} aria-label="Кнопка избранного" />
      </div>

      <div className={styles.profileWrapper} ref={profileRef}>
        <button
          className={styles.userInfo}
          type="button"
          onClick={onProfileClick}
          aria-expanded={isProfileMenuOpen}
          aria-haspopup="menu"
        >
          <span className={styles.userName}>{userName}</span>
          <Avatar src={avatarSrc} size="small" />
        </button>

        {/* Меню появляется только в открытом состоянии. */}
        {isProfileMenuOpen && <ProfileMenuDropdown onLogout={onLogout} />}
      </div>
    </div>
  )
}
