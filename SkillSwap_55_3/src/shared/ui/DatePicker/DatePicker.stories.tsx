import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { DatePicker } from './DatePicker'

const meta = {
  title: 'Shared/UI/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Дата рождения',
    placeholder: 'дд.мм.гггг',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Дата рождения',
    selected: new Date(2026, 7, 24),
  },
}

export const Open: Story = {
  args: {
    label: 'Дата рождения',
    selected: new Date(2000, 3, 27),
    open: true,
  },
}

export const Error: Story = {
  args: {
    label: 'Дата рождения',
    error: 'Введите корректную дату',
  },
}

export const HelperText: Story = {
  args: {
    label: 'Дата рождения',
    helperText: 'Укажите дату рождения',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Дата рождения',
    selected: new Date(2026, 7, 24),
    disabled: true,
  },
}

export const Interactive: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)

    return (
      <DatePicker
        label="Дата рождения"
        placeholder="дд.мм.гггг"
        selected={date}
        onChange={setDate}
      />
    )
  },
}
