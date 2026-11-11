import type { ReactNode } from 'react'
import clsx from 'clsx'

import styles from './RequestCard.module.css'

export interface RequestCardProps {
  /** Иконка карточки (например, лампочка) — приходит через props, компонент её не выбирает сам. */
  icon: ReactNode
  /** Заголовок заявки, например «Николай принял ваш обмен». */
  title: string
  /** Пояснительный текст под заголовком, например «Перейдите в профиль, чтобы обсудить детали». */
  description?: string
  /** Дата/метка, например «сегодня», «вчера», «23 мая». */
  date: string
  /**
   * Кнопки действий — собираются вызывающим кодом из базового Button (VERST-01)
   * и передаются готовыми. Если не переданы, блок с кнопками не рендерится.
   */
  actions?: ReactNode
  className?: string
}

/**
 * RequestCard (VERST-31) — карточка заявки/уведомления об обмене.
 * Разметка единая для всех состояний (новое, просмотренное, на модерации) —
 * различия задаются только через props: title/description/date/icon/actions.
 * Собственной цветной плашки статуса нет (её нет на макете) — статус,
 * если нужен, приходит как часть содержимого через props.
 */
export function RequestCard({ icon, title, description, date, actions, className }: RequestCardProps) {
  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.main}>
        <div className={styles.message}>
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>

          <div className={styles.text}>
            <p className={styles.title}>{title}</p>
            {description && <p className={styles.description}>{description}</p>}
          </div>
        </div>

        <span className={styles.date}>{date}</span>
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
