import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

import iconEye from '../../assets/icons/icon-eye.svg'
import iconEyeSlash from '../../assets/icons/icon-eye-slash.svg'

const meta = {
  title: 'Shared/UI/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Введите email',
    type: 'email',
  },
}

export const Focus: Story = {
  args: {
    label: 'Email',
    placeholder: 'Введите email',
    type: 'email',
  },
}

export const Error: Story = {
  args: {
    label: 'Пароль',
    placeholder: 'Введите пароль',
    type: 'password',
    error: 'Неверный пароль',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Email',
    placeholder: 'Введите email',
    type: 'email',
    disabled: true,
  },
}

export const Password: Story = {
  args: {
    label: 'Пароль',
    placeholder: 'Введите пароль',
    type: 'password',
    showPasswordIcon: <img src={iconEye} alt='' />,
    hidePasswordIcon: <img src={iconEyeSlash} alt='' />,
  },
}

export const PasswordHelperText: Story = {
  args: {
    label: 'Пароль',
    placeholder: 'Введите пароль',
    type: 'password',
    helperText: 'Используйте минимум 8 символов',
  },
}

export const Borderless: Story = {
  args: {
    placeholder: 'Введите город',
    borderless: true,
  },
}