import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { SelectMultiCheckbox, type SelectMultiCheckboxOption } from './SelectMultiCheckbox'

const options: SelectMultiCheckboxOption[] = [
  { value: 'business-career', label: 'Бизнес и карьера' },
  { value: 'foreign-languages', label: 'Иностранные языки' },
  { value: 'home-comfort', label: 'Дом и уют' },
  { value: 'creativity-art', label: 'Творчество и искусство' },
  { value: 'education-development', label: 'Образование и развитие' },
  { value: 'health-lifestyle', label: 'Здоровье и лайфстайл' },
]

const meta = {
  title: 'Shared/UI/SelectMultiCheckbox',
  component: SelectMultiCheckbox,
  parameters: {
    layout: 'centered',
  },
  args: {
    options,
    value: [],
    onChange: () => {},
    placeholder: 'Выберите значения',
    disabled: false,
  },
} satisfies Meta<typeof SelectMultiCheckbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(args.value ?? [])

    return <SelectMultiCheckbox {...args} value={value} onChange={setValue} />
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Навыки',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(args.value ?? [])

    return <SelectMultiCheckbox {...args} value={value} onChange={setValue} />
  },
}

export const WithSelectedValues: Story = {
  args: {
    value: ['business-career', 'foreign-languages'],
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(args.value ?? [])

    return <SelectMultiCheckbox {...args} value={value} onChange={setValue} />
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Empty: Story = {
  args: {
    options: [],
  },
}
