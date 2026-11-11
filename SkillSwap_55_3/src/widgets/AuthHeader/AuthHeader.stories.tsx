import type { Meta, StoryObj } from '@storybook/react-vite'

import { AuthHeader } from './AuthHeader'

// Показываем шапку на всю ширину страницы.
const meta = {
  title: 'Widgets/AuthHeader',
  component: AuthHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AuthHeader>

export default meta

type Story = StoryObj<typeof meta>

// Базовое состояние без логики закрытия.
export const Default: Story = {}
