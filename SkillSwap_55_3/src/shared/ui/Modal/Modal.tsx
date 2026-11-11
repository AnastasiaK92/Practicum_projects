import { ReactNode } from 'react'
import styles from './Modal.module.css'
import clsx from 'clsx'

interface ModalProps {
  children: ReactNode
  className?: string
}

export const Modal = ({ children, className }: ModalProps) => {
  return (
    <>
      <div className={styles.overlay}></div>
      <div className={clsx(styles['modal-wrapper'], className ?? styles['default'])}>
        {children}
      </div>
    </>
  )
}
