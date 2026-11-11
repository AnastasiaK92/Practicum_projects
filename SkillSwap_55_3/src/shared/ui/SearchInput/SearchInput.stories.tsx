import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchInput } from './SearchInput'

const meta = {
  title: 'Shared/UI/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Focus: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
