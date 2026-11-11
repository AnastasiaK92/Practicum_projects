import type { Meta, StoryObj } from '@storybook/react-vite'

import IdeaIcon from '../../assets/icons/icon-idea.svg?react'
import { Button } from '../Button'

import { Toast } from './Toast'

const meta = {
  title: 'Shared/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    icon: <IdeaIcon />,
  },
} satisfies Meta<typeof Toast>

export default meta

type Story = StoryObj<typeof meta>

export const Popup: Story = {
  args: {
    variant: 'popup',
    text: 'Олег предлагает вам обмен',
    action: <Button variant="tertiary">Перейти</Button>,
    onClose: () => {},
    isVisible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Для просмотра анимации появления и исчезновения переключайте значение `isVisible` между `true` и `false` в Controls.',
      },
    },
  },
}

export const New: Story = {
  args: {
    variant: 'new',
    text: 'Олег предлагает вам обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    dateTime: 'сегодня',
    action: <Button>Перейти</Button>,
  },
}

export const Read: Story = {
  args: {
    variant: 'read',
    text: 'Олег предлагает вам обмен',
    description: 'Перейдите в профиль, чтобы обсудить детали',
    dateTime: 'вчера',
  },
}
