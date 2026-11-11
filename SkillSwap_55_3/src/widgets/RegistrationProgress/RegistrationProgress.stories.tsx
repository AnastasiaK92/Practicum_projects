import type { Meta, StoryObj } from '@storybook/react-vite'

import { RegistrationProgress } from './RegistrationProgress'

const meta: Meta<typeof RegistrationProgress> = {
  title: 'Widgets/RegistrationProgress',
  component: RegistrationProgress,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    currentStep: {
      control: 'radio',
      options: [1, 2, 3],
    },
  },
}

export default meta

type Story = StoryObj<typeof RegistrationProgress>

export const Default: Story = {
  args: {
    currentStep: 1,
  },
}

export const StepTwo: Story = {
  args: {
    currentStep: 2,
  },
}

export const StepThree: Story = {
  args: {
    currentStep: 3,
  },
}
