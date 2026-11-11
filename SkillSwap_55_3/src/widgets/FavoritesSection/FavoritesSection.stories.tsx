import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { FavoritesSection, type FavoriteUser } from './FavoritesSection'

const meta: Meta<typeof FavoritesSection> = {
  title: 'Widgets/FavoritesSection',
  component: FavoritesSection,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '1020px',
          minHeight: '752px',
          padding: '60px',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof FavoritesSection>

export const Empty: Story = {
  args: {
    favoriteUsers: [],
    onFavoriteClick: fn(),
    onDetailsClick: fn(),
  },
}

const users: FavoriteUser[] = [
  {
    id: 'user-001',
    name: 'Анна',
    city: 'Москва',
    age: 29,
    avatarUrl: '/images/users/user-001/avatar.webp',
    likesCount: 27,
    canTeach: { label: 'Французский язык', variant: 'languages' },
    learnTags: [
      { label: 'Фотография', variant: 'creative' },
      { label: 'Йога', variant: 'health' },
    ],
  },
  {
    id: 'user-002',
    name: 'Дмитрий',
    city: 'Казань',
    age: 41,
    avatarUrl: '/images/users/user-001/avatar.webp',
    likesCount: 15,
    canTeach: { label: 'Программирование', variant: 'education' },
    learnTags: [
      { label: 'Испанский язык', variant: 'languages' },
      { label: 'Публичные выступления', variant: 'more' },
    ],
  },
  {
    id: 'user-003',
    name: 'Екатерина',
    city: 'Новосибирск',
    age: 26,
    avatarUrl: '/images/users/user-001/avatar.webp',
    likesCount: 42,
    canTeach: { label: 'Графический дизайн', variant: 'creative' },
    learnTags: [
      { label: 'Финансовая грамотность', variant: 'more' },
      { label: 'Бег', variant: 'health' },
    ],
  },
  {
    id: 'user-004',
    name: 'Сергей',
    city: 'Екатеринбург',
    age: 37,
    avatarUrl: '/images/users/user-001/avatar.webp',
    likesCount: 8,
    canTeach: { label: 'Шахматы', variant: 'more' },
    learnTags: [
      { label: 'Веб-разработка', variant: 'business' },
      { label: 'Английский язык', variant: 'languages' },
    ],
  },
  {
    id: 'user-005',
    name: 'Мария',
    city: 'Нижний Новгород',
    age: 32,
    avatarUrl: '/images/users/user-001/avatar.webp',
    likesCount: 36,
    canTeach: { label: 'Маркетинг', variant: 'business' },
    learnTags: [
      { label: 'Медитация', variant: 'health' },
      { label: 'UI/UX дизайн', variant: 'creative' },
    ],
  },
]

export const Filled: Story = {
  args: {
    favoriteUsers: users,
    onFavoriteClick: fn(),
    onDetailsClick: fn(),
  },
}
