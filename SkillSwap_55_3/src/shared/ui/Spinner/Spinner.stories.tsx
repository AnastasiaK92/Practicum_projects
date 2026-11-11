import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Shared/UI/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'number',
      description: 'Размер спиннера в пикселях',
    },
  },
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  args: {
    size: 40,
  },
}

export const Small: Story = {
  args: {
    size: 24,
  },
}

export const Large: Story = {
  args: {
    size: 64,
  },
}
