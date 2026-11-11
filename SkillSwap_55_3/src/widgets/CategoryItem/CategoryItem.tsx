import type { ReactNode } from 'react'
import clsx from 'clsx'

import styles from './CategoryItem.module.css'

export type CategoryItemVariant =
  | 'business'
  | 'creative'
  | 'languages'
  | 'education'
  | 'home'
  | 'health'

type CategoryItemProps = {
  icon: ReactNode
  title: string
  subcategories: string[]
  variant: CategoryItemVariant
}

export const CategoryItem = ({ icon, title, subcategories, variant }: CategoryItemProps) => {
  return (
    <div className={styles.item}>
      <div className={clsx(styles.icon, styles[`icon-${variant}`])} aria-hidden="true">
        {icon}
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>

        <ul className={styles.subcategories}>
          {subcategories.map((subcategory) => (
            <li className={styles.subcategory} key={subcategory}>
              {subcategory}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
