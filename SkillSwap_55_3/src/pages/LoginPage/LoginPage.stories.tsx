import type { Meta, StoryObj } from '@storybook/react-vite'
import LoginPage from './LoginPage'

const meta = {
  title: 'Pages/LoginPage',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    hasError: {
      control: 'boolean',
      description: 'Показывает ошибку авторизации',
    },
  },
} satisfies Meta<typeof LoginPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    hasError: false,
  },
}

export const WithError: Story = {
  args: {
    hasError: true,
  },
}
