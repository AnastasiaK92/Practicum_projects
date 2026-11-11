import type { Category, City, Subcategory, User } from '@/shared/types'
import type { SkillTagVariant } from '@/shared/ui/SkillTag/SkillTag'
import { calculateAge } from '@/shared/lib/helpers'

import type { SkillPageProps } from './SkillPage'

// Соответствие категории навыка и оформления тега. Дублирует такое же
// соответствие в CatalogPage.utils.ts — файлы разных страниц, общий
// экспорт между страницами в проекте не заведён.
const CATEGORY_VARIANTS: Record<string, SkillTagVariant> = {
  'business-career': 'business',
  'foreign-languages': 'languages',
  'home-comfort': 'home',
  'creativity-art': 'creative',
  'education-development': 'education',
  'health-lifestyle': 'health',
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

// Возвращает правильное склонение слова "год" для числового возраста.
function getAgeLabel(age: number): string {
  const lastDigit = age % 10
  const lastTwoDigits = age % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'лет'
  }

  if (lastDigit === 1) {
    return 'год'
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года'
  }

  return 'лет'
}

// Собирает пропсы SkillPage (кроме similarOffers, который считается отдельно
// и не входит в LOGIC-34) из данных пользователя, полученного по userId.
export function mapUserToSkillPageProps(
  user: User,
  categories: Category[],
  cities: City[],
): Omit<SkillPageProps, 'similarOffers' | 'isAuth' | 'authUser'> {
  const city = cities.find(({ id }) => id === user.cityId)
  const offeredSubcategory = findSubcategory(categories, user.offeredSkill.subcategoryId)
  const age = calculateAge(user.birthDate)

  const wantsToLearn = user.learningSubcategoryIds.flatMap((subcategoryId) => {
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
    user: {
      avatar: user.avatarUrl ?? '',
      name: user.name,
      city: city?.name ?? user.cityId,
      age: `${age} ${getAgeLabel(age)}`,
    },
    userDescription: user.description,
    skills: {
      canTeach: {
        label: offeredSubcategory?.subcategory.name ?? user.offeredSkill.title,
        variant: getCategoryVariant(user.offeredSkill.categoryId),
      },
      wantsToLearn,
    },
    skill: {
      title: user.offeredSkill.title,
      category: offeredSubcategory?.category.name ?? '',
      subcategory: offeredSubcategory?.subcategory.name ?? '',
      description: user.offeredSkill.description,
    },
    gallery: user.offeredSkill.imageUrls,
  }
}
