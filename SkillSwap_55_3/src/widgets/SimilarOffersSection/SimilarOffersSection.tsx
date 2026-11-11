import { useEffect, useState } from 'react'

import ChevronRightIcon from '@/shared/assets/icons/icon-chevron-right.svg?react'
import { IconButton } from '@/shared/ui/IconButton'
import { SectionHeader } from '@/widgets/SectionHeader'
import { UserSkillCard, type UserSkillCardProps } from '@/widgets/UserSkillCard'

import styles from './SimilarOffersSection.module.css'

export interface SimilarOffersSectionProps {
  items: UserSkillCardProps[]
}

const ITEMS_PER_GROUP = 4
const MAX_ITEMS = 8

export const SimilarOffersSection = ({ items }: SimilarOffersSectionProps) => {
  const [currentGroup, setCurrentGroup] = useState(0)

  const limitedItems = items.slice(0, MAX_ITEMS)
  const itemsKey = limitedItems.map(({ user }) => user.id).join('|')
  const hasSeveralGroups = limitedItems.length > ITEMS_PER_GROUP

  // При переходе на страницу другого пользователя начинает показ
  // нового набора похожих предложений с первой группы.
  useEffect(() => {
    setCurrentGroup(0)
  }, [itemsKey])

  if (limitedItems.length === 0) {
    return null
  }

  // Защищает выдачу от пустой второй группы, если новый список стал короче.
  const visibleGroup = hasSeveralGroups ? currentGroup : 0
  const startIndex = visibleGroup * ITEMS_PER_GROUP
  const visibleItems = limitedItems.slice(startIndex, startIndex + ITEMS_PER_GROUP)

  const handleNextGroup = () => {
    setCurrentGroup((group) => (group === 0 ? 1 : 0))
  }

  return (
    <section className={styles.section}>
      <SectionHeader title="Похожие предложения" variant="compact" />

      <div className={styles.cardsWrapper}>
        <div className={styles.cards}>
          {visibleItems.map((item) => (
            <UserSkillCard key={item.user.id} {...item} />
          ))}
        </div>

        {hasSeveralGroups && (
          <IconButton
            icon={<ChevronRightIcon />}
            className={styles.nextButton}
            aria-label="Следующие предложения"
            onClick={handleNextGroup}
          />
        )}
      </div>
    </section>
  )
}
