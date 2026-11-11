import React from 'react';
import clsx from 'clsx';
import styles from './ActiveFilterChip.module.css';

import CrossIcon from '@/shared/assets/icons/icon-cross.svg?react';
import { IconButton } from '@/shared/ui/IconButton';

export interface ActiveFilterChipProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export const ActiveFilterChip: React.FC<ActiveFilterChipProps> = ({
  label,
  onRemove,
  className,
}) => {
  return (
    <span className={clsx(styles.chip, className)}>
      <span className={styles.label}>{label}</span>
      {onRemove && (
        <IconButton
          icon={<CrossIcon />}
          className={styles.removeButton}
          onClick={onRemove}
          aria-label={`Удалить фильтр: ${label}`}
        />
      )}
    </span>
  );
};