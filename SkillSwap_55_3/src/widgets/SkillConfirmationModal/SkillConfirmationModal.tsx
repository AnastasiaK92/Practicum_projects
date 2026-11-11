import { Modal } from '@/shared/ui/Modal'
import { SkillGallery } from '@/entities/skill/ui/SkillGallery/SkillGallery'
import { SkillDetails } from '@/entities/skill/ui/SkillDetails'
import type { SkillDetailsProps } from '@/entities/skill/ui/SkillDetails'
import { SkillDetailsButtons } from '@/widgets/SkillDetailsButtons'

import styles from './SkillConfirmationModal.module.css'

export interface SkillConfirmationModalProps
  extends Pick<SkillDetailsProps, 'title' | 'category' | 'subcategory' | 'description'> {
  /** Фотографии навыка — передаются как есть в SkillGallery (VERST-33). */
  images: string[]
  /** Клик по «Редактировать». */
  onEdit?: () => void
  /** Клик по «Готово». */
  onDone?: () => void
  disabled?: boolean
}

/**
 * SkillConfirmationModal (VERST-35) — модалка подтверждения предложенного навыка.
 * Полностью собрана из готовых компонентов (Modal, SkillGallery, SkillDetails,
 * SkillDetailsButtons) — собственной вёрстки для них нет, только статичные
 * заголовок/текст и обёртки для расположения блоков по макету.
 */
export function SkillConfirmationModal({
  images,
  title,
  category,
  subcategory,
  description,
  onEdit,
  onDone,
  disabled,
}: SkillConfirmationModalProps) {
  return (
    <Modal className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Ваше предложение</h2>
        <p className={styles.subheading}>
          Пожалуйста, проверьте и подтвердите правильность данных
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.gallery}>
          <SkillGallery images={images} />
        </div>

        <div className={styles.info}>
          <SkillDetails
            title={title}
            category={category}
            subcategory={subcategory}
            description={description}
          />
          <SkillDetailsButtons variant="edit" onEdit={onEdit} onDone={onDone} disabled={disabled} />
        </div>
      </div>
    </Modal>
  )
}
