import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { UserProfileCard, type UserProfileCardProps } from './UserProfileCard'

const baseProps: UserProfileCardProps = {
  user: {
    avatar: '',
    name: 'Юлия',
    city: 'Москва',
    age: '24 года',
  },
  description: 'Люблю учиться новому',
  skills: {
    canTeach: { variant: 'creative', label: 'Игра на барабанах' },
    wantsToLearn: [{ variant: 'education', label: 'Тайм-менеджмент' }],
  },
}

describe('UserProfileCard', () => {
  it('отображает блок «О себе», если description не пустой', () => {
    render(<UserProfileCard {...baseProps} />)
    expect(screen.getByText('Люблю учиться новому')).toBeInTheDocument()
  })

  it('не рендерит блок «О себе», если description — пустая строка', () => {
    render(<UserProfileCard {...baseProps} description="" />)
    expect(screen.queryByText('Люблю учиться новому')).not.toBeInTheDocument()
    expect(screen.getByText('Юлия')).toBeInTheDocument()
  })
})
