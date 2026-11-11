import type { Meta, StoryObj } from '@storybook/react-vite'

import { SortButton } from './SortButton'

const meta = {
  title: 'Widgets/SortButton',
  component: SortButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SortButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
