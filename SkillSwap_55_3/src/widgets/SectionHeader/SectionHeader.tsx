import clsx from 'clsx'

import ChevronRightIcon from '@/shared/assets/icons/icon-chevron-right.svg?react'
import { Button } from '@/shared/ui/Button'

import styles from './SectionHeader.module.css'

export interface SectionHeaderProps {
  title: string
  variant?: 'default' | 'compact'
  showViewAllButton?: boolean
  viewAllLabel?: string
  isExpanded?: boolean
  onViewAllClick?: () => void
}

export function SectionHeader({
  title,
  variant = 'default',
  showViewAllButton = false,
  viewAllLabel = 'Смотреть все',
  isExpanded = false,
  onViewAllClick,
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <h2 className={`${styles.title} ${styles[variant]}`}>{title}</h2>

      {showViewAllButton && (
        <Button
          variant="tertiary"
          iconPosition="right"
          icon={
            <ChevronRightIcon
              className={clsx(styles.chevron, isExpanded && styles.chevronExpanded)}
            />
          }
          aria-expanded={isExpanded}
          onClick={onViewAllClick}
        >
          {viewAllLabel}
        </Button>
      )}
    </div>
  )
}
