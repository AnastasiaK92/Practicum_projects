import React from 'react'
import clsx from 'clsx'

import {
  SkillTag,
  type SkillTagVariant,
} from '../../../../shared/ui/SkillTag/SkillTag'

import styles from './SkillTagsBlock.module.css'

export type SkillTagsBlockVariant = 'compact' | 'spacious'

export interface SkillTagsBlockProps {
  canTeach: {
    variant: SkillTagVariant
    label: string
  }
  wantsToLearn: Array<{
    variant: SkillTagVariant
    label: string
  }>
  variant?: SkillTagsBlockVariant
}

// Приблизительный лимит суммарной длины названий видимых навыков.
const CHAR_LIMITS: Record<SkillTagsBlockVariant, number> = {
  compact: 25,
  spacious: 21,
}

// Определяет, сколько обычных тегов можно показать вместе с обязательным +N.
const getVisibleCount = (
  tags: SkillTagsBlockProps['wantsToLearn'],
  variant: SkillTagsBlockVariant,
) => {
  if (!tags.length) {
    return 0
  }

  const charLimit = CHAR_LIMITS[variant]

  // Первый тег показываем всегда: если он слишком длинный, SkillTag обрежет текст.
  let usedChars = tags[0].label.length
  let visibleCount = 1

  for (let index = 1; index < tags.length; index++) {
    const tag = tags[index]
    const nextChars = usedChars + tag.label.length

    if (nextChars > charLimit) {
      break
    }

    usedChars = nextChars
    visibleCount++
  }

  return visibleCount
}

export const SkillTagsBlock: React.FC<SkillTagsBlockProps> = ({
  canTeach,
  wantsToLearn,
  variant = 'compact',
}) => {
  // Рассчитываем видимые и скрытые навыки для текущего варианта блока.
  const visibleCount = getVisibleCount(wantsToLearn, variant)
  const visibleTags = wantsToLearn.slice(0, visibleCount)
  const hiddenTagsCount = wantsToLearn.length - visibleCount

  return (
    <div
      className={clsx(styles.container, {
        [styles.spacious]: variant === 'spacious',
      })}
    >
      <div className={styles.tagsBlockContainer}>
        <h3 className={styles.title}>Может научить:</h3>

        <div className={styles.tagsContainer}>
          <SkillTag
            variant={canTeach.variant}
            label={canTeach.label}
          />
        </div>
      </div>

      <div className={styles.tagsBlockContainer}>
        <h3 className={styles.title}>Хочет научиться:</h3>

        <div className={styles.tagsContainer}>
          {visibleTags.map((tag, index) => (
            <SkillTag
              key={`${tag.label}-${index}`}
              variant={tag.variant}
              label={tag.label}
            />
          ))}

          {hiddenTagsCount > 0 && (
            <SkillTag
              variant="more"
              label={`+${hiddenTagsCount}`}
            />
          )}
        </div>
      </div>
    </div>
  )
}
