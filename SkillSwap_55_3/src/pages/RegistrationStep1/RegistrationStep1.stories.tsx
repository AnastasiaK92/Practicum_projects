import type { Meta, StoryObj } from '@storybook/react-vite'

import { RegistrationStep1 } from './RegistrationStep1'

const meta = {
  title: 'Pages/RegistrationStep1',
  component: RegistrationStep1,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RegistrationStep1>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const InvalidEmail: Story = {
  args: {
    emailValue: 'petrov@',
    emailError: 'Некорректный формат email',
  },
}

export const EmailAlreadyUsed: Story = {
  args: {
    emailValue: 'petrov@mail.ru',
    emailError: 'Email уже используется',
  },
}

export const WeakPassword: Story = {
  args: {
    passwordValue: 'Слабый пароль',
    passwordError: 'Недостаточно надёжный пароль',
  },
}