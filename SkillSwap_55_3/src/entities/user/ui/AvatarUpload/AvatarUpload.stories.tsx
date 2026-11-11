import type { Meta, StoryObj } from '@storybook/react-vite'

import { AvatarUpload } from './AvatarUpload'

const meta: Meta<typeof AvatarUpload> = {
  title: 'Entities/User/AvatarUpload',
  component: AvatarUpload,
}

export default meta

type Story = StoryObj<typeof AvatarUpload>

export const DefaultSmall: Story = {
  args: {
    size: 'small',
  },
}

export const SelectedLarge: Story = {
  args: {
    size: 'large',
    image: 'https://picsum.photos/id/64/400/400',
  },
}
