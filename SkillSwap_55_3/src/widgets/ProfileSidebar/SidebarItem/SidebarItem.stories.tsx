import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { SidebarItem } from './SidebarItem'
import RequestIcon from '@/shared/assets/icons/icon-request.svg?react'
import MessageIcon from '@/shared/assets/icons/icon-message-text.svg?react'
import LikeIcon from '@/shared/assets/icons/icon-like.svg?react'
import IdeaIcon from '@/shared/assets/icons/icon-idea.svg?react'
import UserIcon from '@/shared/assets/icons/icon-user.svg?react'

const meta = {
  title: 'Widgets/ProfileSidebar/SidebarItem',
  component: SidebarItem,
  tags: ['autodocs'],
  decorators: [
    (Story: () => JSX.Element) => (
      <div style={{ maxWidth: 244 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: <RequestIcon />,
    label: 'Заявки',
    isActive: false,
  },
}

export const Active: Story = {
  args: {
    icon: <UserIcon />,
    label: 'Личные данные',
    isActive: true,
  },
}

export const Menu: Story = {
  args: {
    icon: <RequestIcon />,
    label: 'Заявки',
    isActive: false,
  },
  render: function Render() {
    const items = [
      { icon: <RequestIcon />, label: 'Заявки' },
      { icon: <MessageIcon />, label: 'Мои обмены' },
      { icon: <LikeIcon />, label: 'Избранное' },
      { icon: <IdeaIcon />, label: 'Мои навыки' },
      { icon: <UserIcon />, label: 'Личные данные' },
    ]
    const [activeIndex, setActiveIndex] = useState(items.length - 1)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, index) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    )
  },
}
