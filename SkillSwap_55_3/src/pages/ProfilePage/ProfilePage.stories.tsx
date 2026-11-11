import type { Meta, StoryObj } from '@storybook/react-vite'

import ProfilePage from './ProfilePage'
import type { ProfileTab } from './ProfilePage'

const profilePageViewports = {
  profilePage: {
    name: 'ProfilePage 1440 × 1372',
    styles: {
      width: '1440px',
      height: '1372px',
    },
    type: 'desktop',
  },
} as const

const meta = {
  title: 'Pages/ProfilePage',
  component: ProfilePage,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: profilePageViewports,
    },
  },
  globals: {
    viewport: {
      value: 'profilePage',
      isRotated: false,
    },
  },
} satisfies Meta<typeof ProfilePage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Личные данные',
  args: {
    initialTab: 'personal' as ProfileTab,
  },
}

export const Favorites: Story = {
  name: 'Избранное',
  args: {
    initialTab: 'favorites' as ProfileTab,
  },
}

export const PlaceholderTab: Story = {
  name: 'Заглушка вкладки (Заявки)',
  args: {
    initialTab: 'requests' as ProfileTab,
  },
}

export const SkillsTab: Story = {
  name: 'Заглушка вкладки (Мои навыки)',
  args: {
    initialTab: 'skills' as ProfileTab,
  },
}