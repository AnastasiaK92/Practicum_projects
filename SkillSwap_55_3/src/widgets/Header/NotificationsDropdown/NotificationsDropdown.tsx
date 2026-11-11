import NotificationIcon from '@/shared/assets/icons/icon-idea.svg?react'
import { Button } from '@/shared/ui/Button'
import { DropdownContainer } from '@/shared/ui/DropdownContainer'

import styles from './NotificationsDropdown.module.css'

// Описывает данные одного уведомления.
interface Notification {
  id: number
  title: string
  description: string
  date: string
  action?: string
}

// Уведомления, которые пользователь ещё не просмотрел.
const NEW_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'Николай принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    date: 'сегодня',
    action: 'Перейти',
  },
  {
    id: 2,
    title: 'Татьяна предлагает вам обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    date: 'сегодня',
    action: 'Перейти',
  },
]

// Уведомления, которые пользователь уже просмотрел.
const READ_NOTIFICATIONS: Notification[] = [
  {
    id: 3,
    title: 'Олег предлагает вам обмен',
    description: 'Примите обмен, чтобы обсудить детали',
    date: 'вчера',
  },
  {
    id: 4,
    title: 'Игорь принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    date: '23 мая',
  },
]

interface NotificationItemProps {
  notification: Notification
}

// Отрисовывает одно уведомление и при необходимости добавляет кнопку действия.
const NotificationItem = ({ notification }: NotificationItemProps) => (
  <li className={styles.item}>
    <div className={styles.itemContent}>
      <div className={styles.message}>
        <NotificationIcon className={styles.icon} aria-hidden="true" />

        <div className={styles.textBlock}>
          <p className={styles.title}>{notification.title}</p>
          <p className={styles.description}>{notification.description}</p>
        </div>
      </div>

      <span className={styles.date}>{notification.date}</span>
    </div>

    {notification.action && <Button size="md">{notification.action}</Button>}
  </li>
)

export const NotificationsDropdown = () => (
  <DropdownContainer className={styles.container}>
    {/* Новые уведомления с доступными действиями. */}
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Новые уведомления</h2>

        <button type="button" className={styles.sectionAction}>
          Прочитать все
        </button>
      </div>

      <ul className={styles.list}>
        {NEW_NOTIFICATIONS.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ul>
    </section>

    {/* Уведомления, которые пользователь уже просмотрел. */}
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Просмотренные</h2>

        <button type="button" className={styles.sectionAction}>
          Очистить
        </button>
      </div>

      <ul className={styles.list}>
        {READ_NOTIFICATIONS.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ul>
    </section>
  </DropdownContainer>
)
