import clsx from 'clsx'

import AddIcon from '../../../../shared/assets/icons/icon-add.svg?react'
import GalleryEditIcon from '../../../../shared/assets/icons/icon-gallery-edit.svg?react'
import UserCircleIcon from '../../../../shared/assets/icons/icon-user-circle.svg?react'
import { ImageUpload } from '../../../../shared/ui/ImageUpload'

import styles from './AvatarUpload.module.css'

type AvatarUploadProps = {
  image?: string
  size?: 'small' | 'large'
  error?: string
  onImageChange?: (image: string | undefined) => void
  onError?: (error: string | undefined) => void
}

export const AvatarUpload = ({
  image,
  size = 'small',
  error,
  onImageChange,
  onError,
}: AvatarUploadProps) => {
  const isLarge = size === 'large'

  return (
    <ImageUpload
      images={image ? [image] : []}
      error={error}
      uploadType="avatar"
      onImagesChange={(images) => onImageChange?.(images[0])}
      onError={onError}
      className={clsx(styles.avatarUpload, isLarge ? styles.large : styles.small)}
      emptyContent={
        <div className={styles.emptyContent}>
          <UserCircleIcon className={styles.userIcon} />

          <span className={styles.add}>
            <AddIcon className={styles.addIcon} />
          </span>
        </div>
      }
      previewContent={
        <div className={styles.previewContent}>
          <img className={styles.avatarImage} src={image} alt="Аватар пользователя" />

          {isLarge && (
            <span className={styles.editActionLarge}>
              <GalleryEditIcon className={styles.editIconLarge} />
            </span>
          )}
        </div>
      }
    />
  )
}
