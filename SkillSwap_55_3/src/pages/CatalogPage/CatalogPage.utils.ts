import type { Category, City, Subcategory, User } from '@/shared/types'
import type { SkillTagVariant } from '@/shared/ui/SkillTag/SkillTag'
import type { Filter } from '@/widgets/AppliedFiltersBar'
import type { CatalogFilters, CatalogGender, CatalogOfferType } from '@/widgets/FiltersSidebar'
import type { UserSkillsSectionItem } from '@/widgets/UserSkillsSection'
import { calculateAge } from '@/shared/lib/helpers'

const CATEGORY_VARIANTS: Record<string, SkillTagVariant> = {
  'business-career': 'business',
  'foreign-languages': 'languages',
  'home-comfort': 'home',
  'creativity-art': 'creative',
  'education-development': 'education',
  'health-lifestyle': 'health',
}

const OFFER_TYPE_LABELS: Record<CatalogOfferType, string> = {
  all: 'Всё',
  learning: 'Хочу научиться',
  teaching: 'Могу научить',
}

const GENDER_LABELS: Record<CatalogGender, string> = {
  all: 'Не имеет значения',
  male: 'Мужской',
  female: 'Женский',
}

interface SubcategoryData {
  category: Category
  subcategory: Subcategory
}

// Находит подкатегорию и её родительскую категорию по идентификатору.
function findSubcategory(
  categories: Category[],
  subcategoryId: string,
): SubcategoryData | undefined {
  for (const category of categories) {
    const subcategory = category.subcategories.find(({ id }) => id === subcategoryId)

    if (subcategory) {
      return {
        category,
        subcategory,
      }
    }
  }

  return undefined
}

// Возвращает оформление тега, соответствующее категории навыка.
function getCategoryVariant(categoryId: string): SkillTagVariant {
  return CATEGORY_VARIANTS[categoryId] ?? 'more'
}

// Преобразует данные пользователя в props карточки каталога.
export function mapUserToCatalogCard(
  user: User,
  categories: Category[],
  cities: City[],
  isFavorite: boolean,
  effectiveLikesCount: number,
  effectiveLearningSubcategoryIds: string[],
): UserSkillsSectionItem {
  const city = cities.find(({ id }) => id === user.cityId)

  const offeredSubcategory = findSubcategory(categories, user.offeredSkill.subcategoryId)

  const learnTags = effectiveLearningSubcategoryIds.flatMap((subcategoryId) => {
    const subcategoryData = findSubcategory(categories, subcategoryId)

    if (!subcategoryData) {
      return []
    }

    return [
      {
        label: subcategoryData.subcategory.name,
        variant: getCategoryVariant(subcategoryData.category.id),
      },
    ]
  })

  return {
    id: user.id,
    name: user.name,
    city: city?.name ?? user.cityId,
    age: calculateAge(user.birthDate),
    gender: user.gender === 'preferNotToSay' ? undefined : user.gender,
    avatarUrl: user.avatarUrl,
    isFavorite,
    likesCount: effectiveLikesCount,
    canTeach: {
      label: offeredSubcategory?.subcategory.name ?? user.offeredSkill.title,
      variant: getCategoryVariant(user.offeredSkill.categoryId),
    },
    learnTags,
  }
}

// Проверяет, выбран ли хотя бы один фильтр.
export function hasActiveCatalogFilters(filters: CatalogFilters): boolean {
  return (
    filters.offerType !== 'all' ||
    filters.gender !== 'all' ||
    filters.subcategoryIds.length > 0 ||
    filters.cityIds.length > 0
  )
}

// Возвращает общее количество выбранных фильтров.
export function getActiveCatalogFiltersCount(filters: CatalogFilters): number {
  return (
    filters.subcategoryIds.length +
    filters.cityIds.length +
    Number(filters.offerType !== 'all') +
    Number(filters.gender !== 'all')
  )
}

// Создаёт список подписей для панели применённых фильтров.
export function buildAppliedCatalogFilters(
  filters: CatalogFilters,
  categories: Category[],
  cities: City[],
): Filter[] {
  const appliedFilters: Filter[] = []

  if (filters.offerType !== 'all') {
    appliedFilters.push({
      id: `offerType:${filters.offerType}`,
      label: OFFER_TYPE_LABELS[filters.offerType],
    })
  }

  if (filters.gender !== 'all') {
    appliedFilters.push({
      id: `gender:${filters.gender}`,
      label: GENDER_LABELS[filters.gender],
    })
  }

  filters.subcategoryIds.forEach((subcategoryId) => {
    const subcategoryData = findSubcategory(categories, subcategoryId)

    if (subcategoryData) {
      appliedFilters.push({
        id: `subcategory:${subcategoryId}`,
        label: subcategoryData.subcategory.name,
      })
    }
  })

  filters.cityIds.forEach((cityId) => {
    const city = cities.find(({ id }) => id === cityId)

    if (city) {
      appliedFilters.push({
        id: `city:${cityId}`,
        label: city.name,
      })
    }
  })

  return appliedFilters
}

// Удаляет один фильтр по идентификатору панели применённых фильтров.
export function removeCatalogFilter(filters: CatalogFilters, filterId: string): CatalogFilters {
  const [filterType, value] = filterId.split(':')

  if (filterType === 'offerType') {
    return {
      ...filters,
      offerType: 'all',
    }
  }

  if (filterType === 'gender') {
    return {
      ...filters,
      gender: 'all',
    }
  }

  if (filterType === 'subcategory') {
    return {
      ...filters,
      subcategoryIds: filters.subcategoryIds.filter((id) => id !== value),
    }
  }

  if (filterType === 'city') {
    return {
      ...filters,
      cityIds: filters.cityIds.filter((id) => id !== value),
    }
  }

  return filters
}

// Сортирует пользователей по количеству добавлений в избранное.
export function getPopularCatalogUsers(
  users: User[],
  limit: number,
  effectiveLikesCountByUserId: Record<string, number>,
): User[] {
  return [...users]
    .sort(
      (firstUser, secondUser) =>
        (effectiveLikesCountByUserId[secondUser.id] ?? secondUser.likesCount) -
        (effectiveLikesCountByUserId[firstUser.id] ?? firstUser.likesCount),
    )
    .slice(0, limit)
}
