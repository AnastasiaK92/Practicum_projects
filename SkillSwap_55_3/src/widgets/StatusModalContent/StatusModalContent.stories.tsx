import type { Meta, StoryObj } from '@storybook/react-vite'

import DoneIcon from '@/shared/assets/icons/icon-done.svg?react'

import { StatusModalContent } from './StatusModalContent'

const meta: Meta<typeof StatusModalContent> = {
  title: 'Widgets/StatusModalContent',
  component: StatusModalContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '436px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof StatusModalContent>

export const Success: Story = {
  args: {
    icon: <DoneIcon />,
    title: 'Ваше предложение создано',
    text: 'Теперь вы можете предложить обмен',
    buttonText: 'Готово',
    onButtonClick: () => {},
  },
}
