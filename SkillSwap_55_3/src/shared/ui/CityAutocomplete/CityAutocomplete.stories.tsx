import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CityAutocomplete } from './CityAutocomplete'

const meta: Meta<typeof CityAutocomplete> = {
  title: 'shared/ui/CityAutocomplete',
  component: CityAutocomplete,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof CityAutocomplete>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('')

    return (
      <div style={{ width: '436px' }}>
        <CityAutocomplete
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
  args: {
    placeholder: 'Введите город',
  },
}

export const WithSelectedCity: Story = {
  render: (args) => {
    const [value, setValue] = useState('Самара')

    return (
      <div style={{ width: '436px' }}>
        <CityAutocomplete
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
  args: {
    placeholder: 'Введите город',
  },
}
