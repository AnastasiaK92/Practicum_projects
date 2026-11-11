import { useMemo, useState } from 'react'
import type { Category, City, User } from '@/shared/types'
import { Footer } from '@/widgets/Footer'
import { HeaderContainer } from '@/widgets/Header/HeaderContainer'
import { FiltersSidebar } from '@/widgets/FiltersSidebar'
import { RecommendedSection } from '@/widgets/RecommendedSection'
import { UserSkillsSection } from '@/widgets/UserSkillsSection'
import { AppliedFiltersBar } from '@/widgets/AppliedFiltersBar'
import { SortButton } from '@/widgets/SortButton'
import { UserSkillCard } from '@/widgets/UserSkillCard'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  resetCatalogFilters,
  setCatalogFilters,
  setCatalogSort,
} from '@/store/slices/catalogFiltersSlice'
import { selectFavoriteUserIds } from '@/store/slices/favoritesSlice'
import {
  selectCatalogUsers,
  selectEffectiveLearningSubcategoryIds,
  selectEffectiveLikesCount,
  selectNewUsers,
  selectPopularUsers,
} from '@/store/slices/usersSlice'
import {
  buildAppliedCatalogFilters,
  getActiveCatalogFiltersCount,
  hasActiveCatalogFilters,
  mapUserToCatalogCard,
  removeCatalogFilter,
} from './CatalogPage.utils'

import styles from './CatalogPage.module.css'

import { Spinner } from '@/shared/ui/Spinner'
import { Button } from '@/shared/ui/Button'

import type { UsersState } from '@/store/slices/usersSlice'

type HeaderMenu = 'allSkills' | 'notifications' | 'profile'

export interface CatalogPageProps {
  users: User[]
  categories: Category[]
  cities: City[]
  usersStatus: UsersState['status']
  usersError: string | null
  hasMockUsers: boolean
  isFavoriteDisabled?: boolean
  isProfileMenuInitiallyOpen?: boolean
  isNotificationsMenuInitiallyOpen?: boolean
  isAllSkillsMenuInitiallyOpen?: boolean
  onFavoriteClick: (id: string) => void
  onDetailsClick: (id: string) => void
  onRetry: () => void
}

const POPULAR_USERS_COLLAPSED_LIMIT = 3
const POPULAR_USERS_EXPANDED_LIMIT = 9

const NEW_USERS_COLLAPSED_LIMIT = 3
const NEW_USERS_EXPANDED_LIMIT = 9

// Определяет меню Header, которое должно быть открыто изначально.
function getInitialHeaderMenu(
  isProfileMenuOpen: boolean,
  isNotificationsMenuOpen: boolean,
  isAllSkillsMenuOpen: boolean,
): HeaderMenu | null {
  if (isNotificationsMenuOpen) {
    return 'notifications'
  }
  if (isProfileMenuOpen) {
    return 'profile'
  }
  if (isAllSkillsMenuOpen) {
    return 'allSkills'
  }
  return null
}

export const CatalogPage = ({
  users,
  categories,
  cities,
  isFavoriteDisabled = false,
  usersStatus,
  usersError,
  hasMockUsers,
  isProfileMenuInitiallyOpen = false,
  isNotificationsMenuInitiallyOpen = false,
  isAllSkillsMenuInitiallyOpen = false,
  onFavoriteClick,
  onDetailsClick,
  onRetry,
}: CatalogPageProps) => {
  const dispatch = useAppDispatch()

  // Хранит все выбранные фильтры каталога.
  const filters = useAppSelector((state) => state.catalogFilters.filters)

  const sort = useAppSelector((state) => state.catalogFilters.sort)

  const [searchQuery, setSearchQuery] = useState('')

  // Список id пользователей, находящихся в избранном.
  const favoriteUserIds = useAppSelector(selectFavoriteUserIds)
  // Строит карту "id пользователя → его эффективный список learningSubcategoryIds".
  const effectiveLearningSubcategoryIdsByUserId = useAppSelector((state) =>
    Object.fromEntries(
      users.map((user) => [user.id, selectEffectiveLearningSubcategoryIds(state, user.id)]),
    ),
  )
  // Строит карту "id пользователя → его эффективное количество лайков".
  const effectiveLikesCountByUserId = useAppSelector((state) =>
    Object.fromEntries(users.map((user) => [user.id, selectEffectiveLikesCount(state, user.id)])),
  )

  // Получает готовую отфильтрованную и отсортированную выдачу каталога.
  const catalogUsers = useAppSelector(selectCatalogUsers)

  const popularUsers = useAppSelector(selectPopularUsers)

  // Получает пользователей, заранее отсортированных от новых к старым.
  const newUsers = useAppSelector(selectNewUsers)

  // Хранит только состояние раскрытия секции «Популярное».
  const [isPopularExpanded, setIsPopularExpanded] = useState(false)

  // Хранит только состояние раскрытия секции «Новое».
  const [isNewExpanded, setIsNewExpanded] = useState(false)

  // Хранит единственное открытое меню Header.
  const [openHeaderMenu, setOpenHeaderMenu] = useState<HeaderMenu | null>(() =>
    getInitialHeaderMenu(
      isProfileMenuInitiallyOpen,
      isNotificationsMenuInitiallyOpen,
      isAllSkillsMenuInitiallyOpen,
    ),
  )

  // Ограничивает секцию тремя или девятью популярными пользователями
  // и преобразует их в данные карточек.
  const popularItems = useMemo(() => {
    const limit = isPopularExpanded ? POPULAR_USERS_EXPANDED_LIMIT : POPULAR_USERS_COLLAPSED_LIMIT

    return popularUsers
      .slice(0, limit)
      .map((user) =>
        mapUserToCatalogCard(
          user,
          categories,
          cities,
          favoriteUserIds.includes(user.id),
          effectiveLikesCountByUserId[user.id] ?? user.likesCount,
          effectiveLearningSubcategoryIdsByUserId[user.id] ?? user.learningSubcategoryIds,
        ),
      )
  }, [
    popularUsers,
    isPopularExpanded,
    categories,
    cities,
    favoriteUserIds,
    effectiveLikesCountByUserId,
    effectiveLearningSubcategoryIdsByUserId,
  ])

  // Ограничивает секцию тремя или девятью новейшими пользователями
  // и преобразует их в данные карточек.
  const newItems = useMemo(() => {
    const limit = isNewExpanded ? NEW_USERS_EXPANDED_LIMIT : NEW_USERS_COLLAPSED_LIMIT

    return newUsers
      .slice(0, limit)
      .map((user) =>
        mapUserToCatalogCard(
          user,
          categories,
          cities,
          favoriteUserIds.includes(user.id),
          effectiveLikesCountByUserId[user.id] ?? user.likesCount,
          effectiveLearningSubcategoryIdsByUserId[user.id] ?? user.learningSubcategoryIds,
        ),
      )
  }, [
    newUsers,
    isNewExpanded,
    categories,
    cities,
    favoriteUserIds,
    effectiveLikesCountByUserId,
    effectiveLearningSubcategoryIdsByUserId,
  ])
  // Подготавливает карточки для секции «Рекомендуем».
  const recommendedItems = useMemo(
    () =>
      users.map((user) =>
        mapUserToCatalogCard(
          user,
          categories,
          cities,
          favoriteUserIds.includes(user.id),
          effectiveLikesCountByUserId[user.id] ?? user.likesCount,
          effectiveLearningSubcategoryIdsByUserId[user.id] ?? user.learningSubcategoryIds,
        ),
      ),
    [
      users,
      categories,
      cities,
      favoriteUserIds,
      effectiveLearningSubcategoryIdsByUserId,
      effectiveLikesCountByUserId,
    ],
  )
  // Проверяет наличие выбранных фильтров.
  const isFiltered = useMemo(() => hasActiveCatalogFilters(filters), [filters])
  // Подготавливает чипы выбранных фильтров.
  const appliedFilters = useMemo(
    () => buildAppliedCatalogFilters(filters, categories, cities),
    [filters, categories, cities],
  )

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  const searchedCatalogUsers = useMemo(() => {
    if (!normalizedSearchQuery) {
      return catalogUsers
    }
    return catalogUsers.filter((user) =>
      user.offeredSkill.title.toLowerCase().includes(normalizedSearchQuery),
    )
  }, [catalogUsers, normalizedSearchQuery])
  // Фильтрует пользователей и преобразует результат в карточки.
  const filteredResults = useMemo(
    () =>
      searchedCatalogUsers.map((user) =>
        mapUserToCatalogCard(
          user,
          categories,
          cities,
          favoriteUserIds.includes(user.id),
          effectiveLikesCountByUserId[user.id] ?? user.likesCount,
          effectiveLearningSubcategoryIdsByUserId[user.id] ?? user.learningSubcategoryIds,
        ),
      ),
    [
      searchedCatalogUsers,
      categories,
      cities,
      favoriteUserIds,
      effectiveLikesCountByUserId,
      effectiveLearningSubcategoryIdsByUserId,
    ],
  )
  // Подсчитывает количество выбранных фильтров.
  const filtersCount = useMemo(() => getActiveCatalogFiltersCount(filters), [filters])

  const hasSearch = normalizedSearchQuery.length > 0

  const hasActiveCatalogOptions = isFiltered || hasSearch || sort !== 'default'

  // Удаляет один фильтр через панель применённых фильтров.
  const handleRemoveFilter = (filterId: string) => {
    dispatch(setCatalogFilters(removeCatalogFilter(filters, filterId)))
  }

  const handleReset = () => {
    setSearchQuery('')
    dispatch(resetCatalogFilters())
  }
  // Переключает выбранное меню и закрывает ранее открытое.
  const toggleHeaderMenu = (menu: HeaderMenu) => {
    setOpenHeaderMenu((currentMenu) => (currentMenu === menu ? null : menu))
  }
  // Открывает или закрывает указанное меню Header.
  const setHeaderMenuOpen = (menu: HeaderMenu, isOpen: boolean) => {
    setOpenHeaderMenu((currentMenu) => {
      if (isOpen) {
        return menu
      }
      return currentMenu === menu ? null : currentMenu
    })
  }
  const isInitialLoading = !hasMockUsers && (usersStatus === 'idle' || usersStatus === 'loading')
  const isError = usersStatus === 'error'

  return (
    <div className={styles.page}>
      <HeaderContainer
        isProfileMenuOpen={openHeaderMenu === 'profile'}
        isNotificationsMenuOpen={openHeaderMenu === 'notifications'}
        onProfileClick={() => toggleHeaderMenu('profile')}
        onProfileMenuClose={() => setHeaderMenuOpen('profile', false)}
        onNotificationsClick={() => toggleHeaderMenu('notifications')}
        onNotificationsMenuClose={() => setHeaderMenuOpen('notifications', false)}
        isAllSkillsMenuOpen={openHeaderMenu === 'allSkills'}
        onAllSkillsMenuOpenChange={(isOpen) => setHeaderMenuOpen('allSkills', isOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className={styles.main}>
        {isInitialLoading ? (
          <div className={styles.state}>
            <Spinner />
          </div>
        ) : isError ? (
          <div className={styles.errorState}>
            <h2 className={styles.errorTitle}>Не удалось загрузить пользователей</h2>
            <p className={styles.errorText}>{usersError ?? 'Попробуйте повторить загрузку'}</p>
            <Button variant="primary" size="md" onClick={onRetry}>
              Повторить
            </Button>
          </div>
        ) : (
          <div className={styles.catalogGrid}>
            <div className={styles.filtersCard}>
              <div className={styles.filtersHeader}>
                <h2 className={styles.filtersTitle}>
                  Фильтры{filtersCount > 0 && ` (${filtersCount})`}
                </h2>
                {hasActiveCatalogOptions && (
                  <button type="button" className={styles.resetButton} onClick={handleReset}>
                    Сбросить ×
                  </button>
                )}
              </div>
              <FiltersSidebar
                categories={categories}
                cities={cities}
                filters={filters}
                onChange={(nextFilters) => dispatch(setCatalogFilters(nextFilters))}
              />
            </div>
            {hasActiveCatalogOptions ? (
              <div className={styles.results}>
                <AppliedFiltersBar filters={appliedFilters} onRemove={handleRemoveFilter} />
                <div className={styles.resultsToolbar}>
                  <h2 className={styles.resultsTitle}>
                    Подходящие предложения: {filteredResults.length}
                  </h2>
                  <SortButton onChange={() => dispatch(setCatalogSort('newest'))} />
                </div>
                {filteredResults.length > 0 ? (
                  <div className={styles.resultsGrid}>
                    {filteredResults.map((item) => (
                      <UserSkillCard
                        key={item.id}
                        user={item}
                        isFavoriteDisabled={isFavoriteDisabled}
                        onFavoriteClick={() => onFavoriteClick(item.id)}
                        onDetailsClick={() => onDetailsClick(item.id)}
                        className={styles.resultsCard}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <h2 className={styles.emptyTitle}>Ничего не найдено</h2>
                    <p className={styles.emptyText}>
                      Попробуйте изменить параметры поиска или сбросить фильтры
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.sections}>
                <UserSkillsSection
                  title="Популярное"
                  items={popularItems}
                  showViewAll={popularUsers.length > POPULAR_USERS_COLLAPSED_LIMIT}
                  viewAllLabel={isPopularExpanded ? 'Свернуть' : 'Смотреть все'}
                  isExpanded={isPopularExpanded}
                  isFavoriteDisabled={isFavoriteDisabled}
                  onViewAllClick={() => setIsPopularExpanded((currentValue) => !currentValue)}
                  onFavoriteClick={onFavoriteClick}
                  onDetailsClick={onDetailsClick}
                />
                <UserSkillsSection
                  title="Новое"
                  items={newItems}
                  showViewAll={newUsers.length > NEW_USERS_COLLAPSED_LIMIT}
                  viewAllLabel={isNewExpanded ? 'Свернуть' : 'Смотреть все'}
                  isExpanded={isNewExpanded}
                  isFavoriteDisabled={isFavoriteDisabled}
                  onViewAllClick={() => setIsNewExpanded((currentValue) => !currentValue)}
                  onFavoriteClick={onFavoriteClick}
                  onDetailsClick={onDetailsClick}
                />
                <RecommendedSection
                  items={recommendedItems}
                  isFavoriteDisabled={isFavoriteDisabled}
                  onFavoriteClick={onFavoriteClick}
                  onDetailsClick={onDetailsClick}
                />
              </div>
            )}
          </div>
        )}
      </main>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}
