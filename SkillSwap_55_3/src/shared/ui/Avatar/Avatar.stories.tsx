import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof Avatar>

export const WithPhoto: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=2',
    size: 'small',
  },
}

export const WithoutPhoto: Story = {
  args: {
    src: '',
    size: 'large',
  },
}

export const WrongPhoto: Story = {
  args: {
    src: 'wrongPhoto.jpeg',
    size: 'large',
  },
}
