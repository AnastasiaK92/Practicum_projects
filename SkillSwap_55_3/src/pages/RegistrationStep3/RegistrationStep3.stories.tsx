import type { Meta, StoryObj } from '@storybook/react-vite'
import { RegistrationStep3 } from './RegistrationStep3'

const meta: Meta<typeof RegistrationStep3> = {
  title: 'Pages/RegistrationStep3',
  component: RegistrationStep3,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof RegistrationStep3>

export const Default: Story = {}