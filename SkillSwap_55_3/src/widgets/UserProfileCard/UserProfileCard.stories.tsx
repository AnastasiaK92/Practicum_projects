import type { Meta, StoryObj } from '@storybook/react-vite'

import { UserProfileCard } from './UserProfileCard'

const meta: Meta<typeof UserProfileCard> = {
  title: 'Widgets/UserProfileCard',
  component: UserProfileCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '324px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof UserProfileCard>

const defaultArgs = {
  user: {
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    name: 'Иван',
    city: 'Санкт-Петербург',
    age: '34 года',
  },
  description:
    'Привет! Люблю ритм, кофе по утрам и людей, которые не боятся пробовать новое',
  skills: {
    canTeach: {
      variant: 'creative' as const,
      label: 'Игра на барабанах',
    },
    wantsToLearn: [
      {
        variant: 'education' as const,
        label: 'Тайм менеджмент',
      },
      {
        variant: 'health' as const,
        label: 'Медитация',
      },
    ],
  },
}

export const Default: Story = {
  args: defaultArgs,
}

export const LongDescription: Story = {
  args: {
    ...defaultArgs,
    description:
      'Привет! Люблю ритм, музыку, кофе по утрам, долгие прогулки и людей, которые не боятся пробовать что-то новое и делиться своим опытом.',
  },
}

export const ManySkills: Story = {
  args: {
    ...defaultArgs,
    skills: {
      ...defaultArgs.skills,
      wantsToLearn: [
        {
          variant: 'education',
          label: 'Тайм менеджментТайм менеджмент',
        },
        {
          variant: 'health',
          label: 'Медитация',
        },
        {
          variant: 'creative',
          label: 'Фотография',
        },
        {
          variant: 'education',
          label: 'Английский язык',
        },
      ],
    },
  },
}
