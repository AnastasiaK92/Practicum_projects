import type { Meta, StoryObj } from '@storybook/react-vite'

import { RegistrationStep2 } from './RegistrationStep2'

const meta = {
  title: 'Pages/RegistrationStep2',
  component: RegistrationStep2,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RegistrationStep2>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
