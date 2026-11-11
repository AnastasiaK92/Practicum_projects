import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { UserSkillCardProps } from '@/widgets/UserSkillCard'

import { SimilarOffersSection } from './SimilarOffersSection'

const createItem = (index: number, prefix = 'Пользователь'): UserSkillCardProps => ({
  user: {
    id: `${prefix}-${index}`,
    name: `${prefix} ${index}`,
    city: 'Москва',
    age: 30,
    avatarUrl: null,
    likesCount: index,
    canTeach: {
      label: 'Фотография',
      variant: 'creative',
    },
    learnTags: [],
  },
  onFavoriteClick: vi.fn(),
  onDetailsClick: vi.fn(),
})

const createItems = (count: number, prefix?: string) =>
  Array.from({ length: count }, (_, index) => createItem(index + 1, prefix))

describe('SimilarOffersSection', () => {
  it('ничего не отображает, если похожих предложений нет', () => {
    const { container } = render(<SimilarOffersSection items={[]} />)

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText('Похожие предложения')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Следующие предложения' })).not.toBeInTheDocument()
  })

  it('показывает найденные 1–4 карточки без стрелки', () => {
    render(<SimilarOffersSection items={createItems(3)} />)

    expect(screen.getByText('Пользователь 1')).toBeInTheDocument()
    expect(screen.getByText('Пользователь 2')).toBeInTheDocument()
    expect(screen.getByText('Пользователь 3')).toBeInTheDocument()
    expect(screen.queryByText('Пользователь 4')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Следующие предложения' })).not.toBeInTheDocument()
  })

  it('для 5–8 карточек переключает группы и возвращается к первой', async () => {
    const user = userEvent.setup()

    render(<SimilarOffersSection items={createItems(8)} />)

    expect(screen.getByText('Пользователь 1')).toBeInTheDocument()
    expect(screen.getByText('Пользователь 4')).toBeInTheDocument()
    expect(screen.queryByText('Пользователь 5')).not.toBeInTheDocument()

    const nextButton = screen.getByRole('button', {
      name: 'Следующие предложения',
    })

    await user.click(nextButton)

    expect(screen.queryByText('Пользователь 1')).not.toBeInTheDocument()
    expect(screen.getByText('Пользователь 5')).toBeInTheDocument()
    expect(screen.getByText('Пользователь 8')).toBeInTheDocument()

    await user.click(nextButton)

    expect(screen.getByText('Пользователь 1')).toBeInTheDocument()
    expect(screen.getByText('Пользователь 4')).toBeInTheDocument()
    expect(screen.queryByText('Пользователь 5')).not.toBeInTheDocument()
  })

  it('на второй группе показывает только оставшиеся карточки', async () => {
    const user = userEvent.setup()

    render(<SimilarOffersSection items={createItems(5)} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Следующие предложения',
      }),
    )

    expect(screen.getByText('Пользователь 5')).toBeInTheDocument()
    expect(screen.queryByText('Пользователь 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Пользователь 6')).not.toBeInTheDocument()
  })

  it('сбрасывает карусель на первую группу при смене набора предложений', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<SimilarOffersSection items={createItems(8)} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Следующие предложения',
      }),
    )

    expect(screen.getByText('Пользователь 5')).toBeInTheDocument()

    rerender(<SimilarOffersSection items={createItems(8, 'Новый пользователь')} />)

    await waitFor(() => {
      expect(screen.getByText('Новый пользователь 1')).toBeInTheDocument()
    })

    expect(screen.getByText('Новый пользователь 4')).toBeInTheDocument()
    expect(screen.queryByText('Новый пользователь 5')).not.toBeInTheDocument()
  })

  it('после сокращения списка не оставляет пустую вторую группу', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<SimilarOffersSection items={createItems(8)} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Следующие предложения',
      }),
    )

    rerender(<SimilarOffersSection items={createItems(2, 'Другой пользователь')} />)

    expect(screen.getByText('Другой пользователь 1')).toBeInTheDocument()
    expect(screen.getByText('Другой пользователь 2')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Следующие предложения' })).not.toBeInTheDocument()
  })
})
