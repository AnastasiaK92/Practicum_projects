import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import type { UserSkillsSectionItem } from '@/widgets/UserSkillsSection'

import { RecommendedSection } from './RecommendedSection'

const baseItems: UserSkillsSectionItem[] = [
  {
    id: 'base-1',
    name: 'Виктория',
    city: 'Кемерово',
    age: 30,
    avatarUrl: 'https://randomuser.me/api/portraits/women/23.jpg',
    likesCount: 45,
    canTeach: {
      label: 'Игра на барабанах',
      variant: 'creative',
    },
    learnTags: [
      {
        label: 'Тайм-менеджмент',
        variant: 'education',
      },
      {
        label: 'Медитация',
        variant: 'health',
      },
    ],
  },
  {
    id: 'base-2',
    name: 'Елизавета',
    city: 'Владивосток',
    age: 25,
    avatarUrl: 'https://randomuser.me/api/portraits/women/24.jpg',
    likesCount: 38,
    canTeach: {
      label: 'Разговорный английский',
      variant: 'languages',
    },
    learnTags: [
      {
        label: 'Фотография',
        variant: 'creative',
      },
      {
        label: 'Йога',
        variant: 'health',
      },
    ],
  },
  {
    id: 'base-3',
    name: 'Виктор',
    city: 'Сочи',
    age: 31,
    avatarUrl: 'https://randomuser.me/api/portraits/men/25.jpg',
    likesCount: 52,
    canTeach: {
      label: 'Основы фотографии',
      variant: 'creative',
    },
    learnTags: [
      {
        label: 'Немецкий язык',
        variant: 'languages',
      },
      {
        label: 'Управление временем',
        variant: 'education',
      },
    ],
  },
  {
    id: 'base-4',
    name: 'Елена',
    city: 'Красноярск',
    age: 28,
    avatarUrl: 'https://randomuser.me/api/portraits/women/26.jpg',
    likesCount: 29,
    canTeach: {
      label: 'Домашняя кухня',
      variant: 'home',
    },
    learnTags: [
      {
        label: 'Рисование',
        variant: 'creative',
      },
      {
        label: 'Испанский язык',
        variant: 'languages',
      },
    ],
  },
  {
    id: 'base-5',
    name: 'Константин',
    city: 'Иркутск',
    age: 36,
    avatarUrl: 'https://randomuser.me/api/portraits/men/27.jpg',
    likesCount: 61,
    canTeach: {
      label: 'Управление командой',
      variant: 'business',
    },
    learnTags: [
      {
        label: 'Правильное питание',
        variant: 'health',
      },
      {
        label: 'Игра на гитаре',
        variant: 'creative',
      },
    ],
  },
  {
    id: 'base-6',
    name: 'София',
    city: 'Абакан',
    age: 24,
    avatarUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
    likesCount: 17,
    canTeach: {
      label: 'Йога для начинающих',
      variant: 'health',
    },
    learnTags: [
      {
        label: 'Проектное управление',
        variant: 'business',
      },
      {
        label: 'Французский язык',
        variant: 'languages',
      },
    ],
  },
]

// Создаёт 18 карточек с уникальными id.
// Этого достаточно для первой порции и двух последовательных догрузок.
const items: UserSkillsSectionItem[] = Array.from({ length: 18 }, (_, index) => {
  const baseItem = baseItems[index % baseItems.length]
  const groupNumber = Math.floor(index / baseItems.length) + 1

  return {
    ...baseItem,
    id: `recommended-user-${index + 1}`,
    name: groupNumber === 1 ? baseItem.name : `${baseItem.name} ${groupNumber}`,
    likesCount: baseItem.likesCount + index,
  }
})

const meta = {
  title: 'Widgets/RecommendedSection',
  component: RecommendedSection,
  tags: ['autodocs'],
  args: {
    onFavoriteClick: fn(),
    onDetailsClick: fn(),
  },
} satisfies Meta<typeof RecommendedSection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items,
  },
}
