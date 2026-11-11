import { describe, expect, it } from 'vitest'
import type { Category, City, User } from '@/shared/types'
import { mapUserToSkillPageProps } from './SkillPage.utils'

const categories: Category[] = [
  {
    id: 'creativity-art',
    name: 'Творчество и искусство',
    subcategories: [{ id: 'music-sound', name: 'Музыка и звук' }],
  },
  {
    id: 'education-development',
    name: 'Образование и развитие',
    subcategories: [{ id: 'time-management', name: 'Тайм-менеджмент' }],
  },
]

const cities: City[] = [{ id: 'spb', name: 'Санкт-Петербург' }]

const user: User = {
  id: 'user-001',
  name: 'Иван',
  birthDate: '1992-01-01',
  gender: 'male',
  cityId: 'spb',
  avatarUrl: 'avatar.png',
  description: 'Привет!',
  offeredSkill: {
    title: 'Игра на барабанах',
    categoryId: 'creativity-art',
    subcategoryId: 'music-sound',
    description: 'Научу играть на барабанах',
    imageUrls: ['image-1.png', 'image-2.png'],
  },
  learningSubcategoryIds: ['time-management'],
  likesCount: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
}

describe('mapUserToSkillPageProps', () => {
  it('собирает пропсы страницы навыка из данных пользователя', () => {
    const result = mapUserToSkillPageProps(user, categories, cities)

    expect(result.user).toEqual({
      avatar: 'avatar.png',
      name: 'Иван',
      city: 'Санкт-Петербург',
      age: expect.stringMatching(/^\d+ (год|года|лет)$/),
    })
    expect(result.userDescription).toBe('Привет!')
    expect(result.skill).toEqual({
      title: 'Игра на барабанах',
      category: 'Творчество и искусство',
      subcategory: 'Музыка и звук',
      description: 'Научу играть на барабанах',
    })
    expect(result.gallery).toEqual(['image-1.png', 'image-2.png'])
    expect(result.skills.canTeach).toEqual({ label: 'Музыка и звук', variant: 'creative' })
    expect(result.skills.wantsToLearn).toEqual([
      { label: 'Тайм-менеджмент', variant: 'education' },
    ])
  })

  it('использует cityId и title навыка, если город или подкатегория не найдены в справочниках', () => {
    const userWithUnknownIds: User = {
      ...user,
      cityId: 'unknown-city',
      offeredSkill: { ...user.offeredSkill, subcategoryId: 'unknown-subcategory' },
    }
    const result = mapUserToSkillPageProps(userWithUnknownIds, categories, cities)

    expect(result.user.city).toBe('unknown-city')
    expect(result.skill.category).toBe('')
    expect(result.skill.subcategory).toBe('')
    expect(result.skills.canTeach.label).toBe('Игра на барабанах')
  })

  it('отбрасывает неизвестные subcategoryId из learningSubcategoryIds', () => {
    const userWithUnknownLearning: User = {
      ...user,
      learningSubcategoryIds: ['time-management', 'unknown-subcategory'],
    }
    const result = mapUserToSkillPageProps(userWithUnknownLearning, categories, cities)

    expect(result.skills.wantsToLearn).toEqual([
      { label: 'Тайм-менеджмент', variant: 'education' },
    ])
  })

  it('подставляет пустую строку avatar, если avatarUrl — null', () => {
    const userWithoutAvatar: User = { ...user, avatarUrl: null }
    const result = mapUserToSkillPageProps(userWithoutAvatar, categories, cities)

    expect(result.user.avatar).toBe('')
  })

  it('передаёт description пользователя как есть, включая пустую строку', () => {
    const userWithoutDescription: User = { ...user, description: '' }
    const result = mapUserToSkillPageProps(userWithoutDescription, categories, cities)

    expect(result.userDescription).toBe('')
  })
})
