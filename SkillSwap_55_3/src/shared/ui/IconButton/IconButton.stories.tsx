import type { Meta, StoryObj } from '@storybook/react-vite'
import MoonIcon from '../../assets/icons/icon-moon.svg?react'
import { IconButton } from './IconButton'
import LikeIcon from '../../assets/icons/icon-like.svg?react'
import LikeFilledIcon from '../../assets/icons/icon-like-filled.svg?react'
import NotificationIcon from '../../assets/icons/icon-notification.svg?react'

const meta = {
  title: 'Shared/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: <MoonIcon />,
    'aria-label': 'Переключить тему',
  },
}

export const Disabled: Story = {
  args: {
    icon: <MoonIcon />,
    'aria-label': 'Переключить тему',
    disabled: true,
  },
}

export const Like: Story = {
  args: {
    icon: <LikeIcon />,
    'aria-label': 'Добавить в избранное',
  },
}

export const LikeFilled: Story = {
  args: {
    icon: <LikeFilledIcon />,
    'aria-label': 'Убрать из избранного',
  },
}

export const Notification: Story = {
  args: {
    icon: <NotificationIcon />,
    'aria-label': 'Уведомления',
  },
}


