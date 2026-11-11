import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/shared/ui/Button'
import IdeaIcon from '@/shared/assets/icons/icon-idea.svg?react'

import { RequestCard } from './RequestCard'

const meta = {
  title: 'Entities/Request/RequestCard',
  component: RequestCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '436px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RequestCard>

export default meta

type Story = StoryObj<typeof meta>

export const New: Story = {
  args: {
    icon: <IdeaIcon />,
    title: 'Николай принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    date: 'сегодня',
    actions: <Button>Перейти</Button>,
  },
}

export const Viewed: Story = {
  args: {
    icon: <IdeaIcon />,
    title: 'Игорь принял ваш обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    date: '23 мая',
  },
}

export const Moderation: Story = {
  args: {
    icon: <IdeaIcon />,
    title: 'Заявка на модерацию',
    description: 'Примите решение по заявке',
    date: 'сегодня',
    actions: (
      <>
        <Button>Принять</Button>
        <Button variant="secondary">Отклонить</Button>
      </>
    ),
  },
}
