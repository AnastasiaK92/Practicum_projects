import { ReactNode } from 'react'
import styles from './StatusModalContent.module.css'
import { Button } from '@/shared/ui/Button'

export interface StatusModalContentProps {
  icon: ReactNode
  title: string
  text: string
  buttonText: string
  onButtonClick: () => void
}

export const StatusModalContent = ({
  icon,
  title,
  text,
  buttonText,
  onButtonClick,
}: StatusModalContentProps) => {

  return (
    <div className={styles['modal-content__wrapper']}>
      <span
        className={styles['modal-content__icon-wrapper']}
        aria-hidden="true"
      >
        {icon}
      </span>

      <div className={styles['modal-content__content']}>
        <div className={styles['modal-content__text-group']}>
          <h2 className={styles['modal-content__title']}>{title}</h2>
          <p className={styles['modal-content__text']}>{text}</p>
        </div>

        <Button
          className={styles['modal-content__button']}
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
