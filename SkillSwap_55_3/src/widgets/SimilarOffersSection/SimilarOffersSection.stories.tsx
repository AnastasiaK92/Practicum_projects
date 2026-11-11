import type { Meta, StoryObj } from '@storybook/react-vite'

import type { UserSkillCardProps } from '@/widgets/UserSkillCard'

import { SimilarOffersSection } from './SimilarOffersSection'

const createItem = (
  index: number,
  overrides: Partial<UserSkillCardProps['user']> = {},
): UserSkillCardProps => ({
  user: {
    id: `story-user-${index}`,
    name: `Пользователь ${index}`,
    city: 'Москва',
    age: 25 + index,
    avatarUrl: null,
    likesCount: 10 + index,
    canTeach: {
      label: 'Фотография',
      variant: 'creative',
    },
    learnTags: [
      {
        label: 'Английский язык',
        variant: 'languages',
      },
    ],
    ...overrides,
  },
  onFavoriteClick: () => {},
  onDetailsClick: () => {},
})

const meta = {
  title: 'Widgets/SimilarOffersSection',
  component: SimilarOffersSection,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SimilarOffersSection>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    items: [],
  },
}

export const UpToFour: Story = {
  args: {
    items: [
      createItem(1, {
        name: 'Анна Петрова',
        city: 'Москва',
        likesCount: 22,
        canTeach: {
          label: 'Английский язык',
          variant: 'languages',
        },
      }),
      createItem(2, {
        name: 'Максим Иванов',
        city: 'Санкт-Петербург',
        likesCount: 35,
        canTeach: {
          label: 'Фотография',
          variant: 'creative',
        },
      }),
      createItem(3, {
        name: 'Екатерина Смирнова',
        city: 'Казань',
        likesCount: 18,
        canTeach: {
          label: 'Рисование и иллюстрация',
          variant: 'creative',
        },
      }),
      createItem(4, {
        name: 'Дмитрий Волков',
        city: 'Новосибирск',
        likesCount: 47,
        canTeach: {
          label: 'Музыка и звук',
          variant: 'creative',
        },
      }),
    ],
  },
}

export const Carousel: Story = {
  args: {
    items: [
      createItem(1, {
        name: 'Анна Петрова',
        city: 'Москва',
        likesCount: 22,
        canTeach: {
          label: 'Английский язык',
          variant: 'languages',
        },
      }),
      createItem(2, {
        name: 'Максим Иванов',
        city: 'Санкт-Петербург',
        likesCount: 35,
        canTeach: {
          label: 'Фотография',
          variant: 'creative',
        },
      }),
      createItem(3, {
        name: 'Екатерина Смирнова',
        city: 'Казань',
        likesCount: 18,
        canTeach: {
          label: 'Рисование и иллюстрация',
          variant: 'creative',
        },
      }),
      createItem(4, {
        name: 'Дмитрий Волков',
        city: 'Новосибирск',
        likesCount: 47,
        canTeach: {
          label: 'Музыка и звук',
          variant: 'creative',
        },
      }),
      createItem(5, {
        name: 'Мария Соколова',
        city: 'Самара',
        likesCount: 31,
        canTeach: {
          label: 'Видеомонтаж',
          variant: 'creative',
        },
      }),
      createItem(6, {
        name: 'Алексей Кузнецов',
        city: 'Казань',
        likesCount: 26,
        canTeach: {
          label: 'Маркетинг и реклама',
          variant: 'business',
        },
      }),
      createItem(7, {
        name: 'Ольга Морозова',
        city: 'Москва',
        likesCount: 40,
        canTeach: {
          label: 'Йога и медитация',
          variant: 'health',
        },
      }),
      createItem(8, {
        name: 'Иван Орлов',
        city: 'Санкт-Петербург',
        likesCount: 29,
        canTeach: {
          label: 'Приготовление еды',
          variant: 'home',
        },
      }),
    ],
  },
}
