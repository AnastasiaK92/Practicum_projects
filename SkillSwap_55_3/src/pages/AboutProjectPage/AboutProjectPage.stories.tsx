import type { Meta, StoryObj } from '@storybook/react-vite'

import { AboutProjectPage } from './AboutProjectPage'

const meta = {
  title: 'Pages/AboutProjectPage',
  component: AboutProjectPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AboutProjectPage>

export default meta

type Story = StoryObj<typeof meta>

export const Guest: Story = {
  name: 'Не авторизован',
}

export const Authenticated: Story = {
  name: 'Авторизован',
  args: {
    headerUser: {
      userName: 'Мария',
      avatarSrc: '/images/users/user-001/avatar.webp',
    },
  },
}
