import type { Meta, StoryObj } from '@storybook/react-vite'
import { UserInfo } from './UserInfo'

const meta = {
  title: 'Entities/User/UserInfo',
  component: UserInfo,
  parameters: {
    layout: 'centered',
  },
  args: {
    avatar: 'https://i.pravatar.cc/150?img=47',
    name: 'Анна',
    city: 'Таллин',
    age: '24 года',
  },
} satisfies Meta<typeof UserInfo>

export default meta

type Story = StoryObj<typeof meta>

export const WithoutFavorite: Story = {
  args: {
    withFavoriteButton: false,
  },
}

export const WithFavorite: Story = {
  args: {
    withFavoriteButton: true,
  },
}
