import type { Meta, StoryObj } from '@storybook/react-vite'

import { SectionHeader } from './SectionHeader'

const meta: Meta<typeof SectionHeader> = {
  title: 'Widgets/SectionHeader',
  component: SectionHeader,
}

export default meta

type Story = StoryObj<typeof SectionHeader>

export const WithButtonNew: Story = {
  args: {
    title: 'Новое',
    showViewAllButton: true,
  },
}

export const WithButtonPopular: Story = {
  args: {
    title: 'Популярное',
    showViewAllButton: true,
  },
}

export const WithoutButton: Story = {
  args: {
    title: 'Рекомендуем',
  },
}
