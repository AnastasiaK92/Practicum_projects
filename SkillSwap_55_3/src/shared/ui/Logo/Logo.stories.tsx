import type { Meta, StoryObj } from '@storybook/react-vite'
import { Logo } from './Logo'

const meta: Meta<typeof Logo> = {
  title: 'Shared/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof Logo>

export const Default: Story = {}
