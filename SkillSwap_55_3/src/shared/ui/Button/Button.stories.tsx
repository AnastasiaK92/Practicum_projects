import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
}

export default meta

type Story = StoryObj<typeof Button>

// Основные варианты кнопки

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary',
  },
}

// Disabled-состояния

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Disabled',
    disabled: true,
  },
}

export const SecondaryDisabled: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Disabled',
    disabled: true,
  },
}

export const TertiaryDisabled: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary Disabled',
    disabled: true,
  },
}

// Размеры

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
}
