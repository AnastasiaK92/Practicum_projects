import type { Meta, StoryObj } from '@storybook/react-vite'
import lightBulbIllustration from '../../assets/illustrations/illustration-light-bulb.svg'
import schoolBoardIllustration from '../../assets/illustrations/illustration-school-board.svg'
import userInfoIllustration from '../../assets/illustrations/illustration-user-info.svg'

import { ImageUpload } from './ImageUpload'

const meta = {
  title: 'Shared/ImageUpload',
  component: ImageUpload,
} satisfies Meta<typeof ImageUpload>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    hint: 'Перетащите или выберите изображения навыка',
    actionText: 'Выбрать изображения',
  },
}

export const Preview: Story = {
  args: {
    images: [lightBulbIllustration, schoolBoardIllustration, userInfoIllustration],
  },
}

export const Error: Story = {
  args: {
    error: 'Не удалось загрузить изображение',
  },
}
