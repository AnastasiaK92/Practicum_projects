import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('работает самостоятельно без внешнего значения', async () => {
    const user = userEvent.setup()

    render(<SearchInput />)

    const input = screen.getByPlaceholderText('Искать навык')

    await user.type(input, 'Дизайн')

    expect(input).toHaveValue('Дизайн')

    await user.click(
      screen.getByRole('button', {
        name: 'Очистить поле поиска',
      }),
    )

    expect(input).toHaveValue('')
  })

  it('передаёт новое значение родителю в controlled-режиме', async () => {
    const user = userEvent.setup()

    const ControlledSearchInput = () => {
      const [value, setValue] = useState('')

      return <SearchInput value={value} onValueChange={setValue} />
    }

    render(<ControlledSearchInput />)

    const input = screen.getByPlaceholderText('Искать навык')

    await user.type(input, 'Python')

    expect(input).toHaveValue('Python')

    await user.click(
      screen.getByRole('button', {
        name: 'Очистить поле поиска',
      }),
    )

    expect(input).toHaveValue('')
  })
})
