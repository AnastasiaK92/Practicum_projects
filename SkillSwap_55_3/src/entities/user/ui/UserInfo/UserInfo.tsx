import LikeIcon from '../../../../shared/assets/icons/icon-like.svg?react'
import LikeFilledIcon from '../../../../shared/assets/icons/icon-like-filled.svg?react'
import { Avatar } from '../../../../shared/ui/Avatar'
import { IconButton } from '../../../../shared/ui/IconButton'
import styles from './UserInfo.module.css'

export interface UserInfoProps {
  avatar: string
  name: string
  city: string
  age: string
  withFavoriteButton?: boolean
  isFavorite?: boolean
  isFavoriteDisabled?: boolean
  likesCount?: number
  onFavoriteClick?: () => void
}

export function UserInfo({
  avatar,
  name,
  city,
  age,
  withFavoriteButton = false,
  isFavorite = false,
  isFavoriteDisabled = false,
  likesCount,
  onFavoriteClick,
}: UserInfoProps) {
  return (
    <div className={styles.userInfo}>
      <Avatar src={avatar} size="medium" />

      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.details}>
          {city}, {age}
        </p>
      </div>

      {withFavoriteButton && (
        <div className={styles.favoriteControl}>
          <span className={styles.likesCount}>{likesCount ?? 0}</span>

          <IconButton
            icon={isFavorite ? <LikeFilledIcon /> : <LikeIcon />}
            className={
              isFavorite
                ? `${styles.favoriteButton} ${styles.favoriteButtonActive}`
                : styles.favoriteButton
            }
            aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
            disabled={isFavoriteDisabled}
            onClick={onFavoriteClick}
          />
        </div>
      )}
    </div>
  )
}
