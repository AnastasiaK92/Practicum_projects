import type { ReactNode } from 'react'
import styles from './AuthInfoBlock.module.css'

export type AuthInfoBlockProps = {
  illustration: ReactNode
  title: string
  description: string
}

export const AuthInfoBlock = ({ illustration, title, description }: AuthInfoBlockProps) => {
  return (
    <div className={styles.authInfo}>
      <div className={styles.authInfo_illustration}>{illustration}</div>
      <div className={styles.authInfo_content}>
        <h2 className={styles.authInfo_title}>{title}</h2>
        <p className={styles.authInfo_description}>{description}</p>
      </div>
    </div>
  )
}
