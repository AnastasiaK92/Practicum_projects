import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { UserInfo } from './UserInfo'

const defaultProps = {
  avatar: '',
  name: 'Анна',
  city: 'Москва',
  age: '30 лет',
  withFavoriteButton: true,
  likesCount: 10,
}

describe('UserInfo — Favorites', () => {
  it('блокирует кнопку Favorites для гостя', () => {
    render(<UserInfo {...defaultProps} isFavoriteDisabled onFavoriteClick={vi.fn()} />)

    expect(
      screen.getByRole('button', {
        name: 'Добавить в избранное',
      }),
    ).toBeDisabled()
  })

  it('не вызывает обработчик заблокированной кнопки', async () => {
    const user = userEvent.setup()
    const onFavoriteClick = vi.fn()

    render(<UserInfo {...defaultProps} isFavoriteDisabled onFavoriteClick={onFavoriteClick} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Добавить в избранное',
      }),
    )

    expect(onFavoriteClick).not.toHaveBeenCalled()
  })

  it('разрешает авторизованному пользователю нажать кнопку', async () => {
    const user = userEvent.setup()
    const onFavoriteClick = vi.fn()

    render(
      <UserInfo {...defaultProps} isFavoriteDisabled={false} onFavoriteClick={onFavoriteClick} />,
    )

    const favoriteButton = screen.getByRole('button', {
      name: 'Добавить в избранное',
    })

    expect(favoriteButton).toBeEnabled()

    await user.click(favoriteButton)

    expect(onFavoriteClick).toHaveBeenCalledTimes(1)
  })
})
