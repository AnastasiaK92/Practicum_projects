import type { Meta, StoryObj } from '@storybook/react-vite'

import { NotificationsDropdown } from './NotificationsDropdown'

const meta = {
  title: 'Widgets/Header/NotificationsDropdown',
  component: NotificationsDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NotificationsDropdown>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
