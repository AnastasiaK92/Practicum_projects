import { useState } from 'react'
import styles from './Avatar.module.css'
import clsx from 'clsx'

interface AvatarProps {
  src: string
  size: 'small' | 'medium' | 'large'
}

export const Avatar = (props: AvatarProps) => {
  const { src, size } = props
  const [isError, setIsError] = useState(false)

  return (
    <div className={clsx(styles['avatar-wrapper'], styles[`avatar-wrapper-${size}`])}>
      {src && !isError && (
        <img
          src={src}
          alt=""
          className={styles.avatar}
          onError={() => setIsError(true)} />
      )}
    </div>
  )
}
