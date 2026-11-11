import React from 'react';
import clsx from 'clsx';
import { Button } from '@/shared/ui/Button';
import EditIcon from '@/shared/assets/icons/icon-edit.svg?react';
import styles from './SkillDetailsButtons.module.css';

export type SkillDetailsButtonsVariant = 'offer' | 'edit';

export interface SkillDetailsButtonsProps {
  variant: SkillDetailsButtonsVariant;
  onOffer?: () => void;
  onEdit?: () => void;
  onDone?: () => void;
  disabled?: boolean;
  className?: string;
}

export const SkillDetailsButtons: React.FC<SkillDetailsButtonsProps> = ({
  variant,
  onOffer,
  onEdit,
  onDone,
  disabled = false,
  className,
}) => {
  if (variant === 'offer') {
    return (
      <div className={clsx(styles.container, className)}>
        <Button
          variant="primary"
          size="md"
          onClick={onOffer}
          disabled={disabled}
          className={styles.button}
        >
          Предложить обмен
        </Button>
      </div>
    );
  }

  return (
    <div className={clsx(styles.container, className)}>
      <Button
        variant="secondary"
        size="md"
        onClick={onEdit}
        disabled={disabled}
        icon={<EditIcon />}
        iconPosition="right"
        className={styles.button}
      >
        Редактировать
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={onDone}
        disabled={disabled}
        className={styles.button}
      >
        Готово
      </Button>
    </div>
  );
};
