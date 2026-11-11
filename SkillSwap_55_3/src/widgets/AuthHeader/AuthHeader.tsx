import CrossIcon from '../../shared/assets/icons/icon-cross.svg?react'
import { Button } from '../../shared/ui/Button'
import { Logo } from '../../shared/ui/Logo'

import styles from './AuthHeader.module.css'

// Собираем упрощённую шапку из готовых shared-компонентов.
export const AuthHeader = () => {
  return (
    <header className={styles.header}>
      <Logo />

      {/* Кнопка пока отображается без логики закрытия. */}
      <Button
        className={styles.closeButton}
        variant="tertiary"
        size="md"
        icon={<CrossIcon />}
        iconPosition="right"
      >
        Закрыть
      </Button>
    </header>
  )
}
