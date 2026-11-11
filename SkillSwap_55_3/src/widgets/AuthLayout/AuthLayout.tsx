import React, { ReactNode, PropsWithChildren } from 'react'
import { AuthHeader } from '../AuthHeader'
import { AuthInfoBlock, AuthInfoBlockProps } from '../AuthInfoBlock'
import styles from './AuthLayout.module.css'

export interface AuthLayoutProps extends PropsWithChildren {
  children: ReactNode
  topContent: ReactNode
  infoBlockProps: AuthInfoBlockProps
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, topContent, infoBlockProps }) => {
  return (
    <>
      <AuthHeader />
      <main className={styles.main}>
        <div className={styles.topContent}>{topContent}</div>
        <div className={styles.columns}>
          <div className={`${styles.column} ${styles.leftColumn}`}>{children}</div>
          <div className={`${styles.column} ${styles.rightColumn}`}>
            <AuthInfoBlock {...infoBlockProps} />
          </div>
        </div>
      </main>
    </>
  )
}
