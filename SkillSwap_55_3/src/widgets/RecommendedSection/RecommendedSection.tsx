import { useEffect, useMemo, useRef, useState } from 'react'
import { Spinner } from '@/shared/ui/Spinner'
import { UserSkillsSection } from '@/widgets/UserSkillsSection'
import type { UserSkillsSectionItem } from '@/widgets/UserSkillsSection'

import styles from './RecommendedSection.module.css'

export interface RecommendedSectionProps {
  /** Данные карточек для UserSkillsSection. */
  items: UserSkillsSectionItem[]
  /** Клик по сердечку конкретной карточки. */
  onFavoriteClick: (id: string) => void
  /** Клик по кнопке «Подробнее». */
  onDetailsClick: (id: string) => void
  /** Блокирует Favorites для гостя. */
  isFavoriteDisabled?: boolean
}

const ITEMS_PER_BATCH = 6

function shuffleItems(itemIds: string[]): string[] {
  const shuffledItemIds = [...itemIds]
  for (let index = shuffledItemIds.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffledItemIds[index], shuffledItemIds[randomIndex]] = [
      shuffledItemIds[randomIndex],
      shuffledItemIds[index],
    ]
  }
  return shuffledItemIds
}

function getLoadingDelay(): number {
  return 1000 + Math.floor(Math.random() * 1000)
}

export function RecommendedSection({
  items,
  onFavoriteClick,
  onDetailsClick,
  isFavoriteDisabled = false,
}: RecommendedSectionProps) {
  const [shuffledItemIds, setShuffledItemIds] = useState<string[]>([])
  const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_PER_BATCH)
  const [isLoading, setIsLoading] = useState(false)
  const hasInitializedShuffleRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    if (!hasInitializedShuffleRef.current && items.length > 0) {
      hasInitializedShuffleRef.current = true
      setShuffledItemIds(shuffleItems(items.map((item) => item.id)))
    }
  }, [items])

  const visibleItems = useMemo(() => {
    const itemsById = new Map(items.map((item) => [item.id, item]))

    return shuffledItemIds
      .slice(0, visibleItemsCount)
      .map((id) => itemsById.get(id))
      .filter((item): item is UserSkillsSectionItem => item !== undefined)
  }, [items, shuffledItemIds, visibleItemsCount])

  const hasMoreItems = visibleItemsCount < shuffledItemIds.length

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMoreItems) {
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || isLoadingRef.current || loadingTimerRef.current) {
        return
      }
      isLoadingRef.current = true
      setIsLoading(true)
      loadingTimerRef.current = setTimeout(() => {
        setVisibleItemsCount((currentCount) => currentCount + ITEMS_PER_BATCH)
        isLoadingRef.current = false
        setIsLoading(false)
        loadingTimerRef.current = null
      }, getLoadingDelay())
    })
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current)
        loadingTimerRef.current = null
      }
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [hasMoreItems])

  return (
    <div className={styles.section}>
      <UserSkillsSection
        title="Рекомендуем"
        items={visibleItems}
        showViewAll={false}
        isFavoriteDisabled={isFavoriteDisabled}
        onFavoriteClick={onFavoriteClick}
        onDetailsClick={onDetailsClick}
      />
      {isLoading && (
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      )}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
    </div>
  )
}
