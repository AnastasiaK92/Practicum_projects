import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { UserSkillsSectionItem } from '@/widgets/UserSkillsSection'

import { RecommendedSection } from './RecommendedSection'

vi.mock('@/widgets/UserSkillsSection', () => ({
  UserSkillsSection: ({ items }: { items: UserSkillsSectionItem[] }) => (
    <div data-testid="recommended-list">
      {items.map((item) => (
        <div key={item.id} data-testid="recommended-card">
          {item.id}
        </div>
      ))}
    </div>
  ),
}))

const createItems = (count: number): UserSkillsSectionItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `user-${index + 1}`,
    name: `Пользователь ${index + 1}`,
    city: 'Москва',
    age: 30,
    avatarUrl: null,
    likesCount: index,
    canTeach: {
      label: 'Английский язык',
      variant: 'languages',
    },
    learnTags: [],
  }))

describe('RecommendedSection — infinite loading', () => {
  let observerCallback: IntersectionObserverCallback = () => {}
  let observer = {} as IntersectionObserver
  let observeMock: ReturnType<typeof vi.fn>
  let disconnectMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0)

    observeMock = vi.fn()
    disconnectMock = vi.fn()

    observer = {
      observe: observeMock,
      disconnect: disconnectMock,
      unobserve: vi.fn(),
      takeRecords: vi.fn(() => []),
      root: null,
      rootMargin: '0px',
      thresholds: [0],
    } as unknown as IntersectionObserver

    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn((callback: IntersectionObserverCallback) => {
        observerCallback = callback
        return observer
      }),
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  const renderSection = (items: UserSkillsSectionItem[]) =>
    render(<RecommendedSection items={items} onFavoriteClick={vi.fn()} onDetailsClick={vi.fn()} />)

  const intersectSentinel = () => {
    act(() => {
      observerCallback([{ isIntersecting: true } as IntersectionObserverEntry], observer)
    })
  }

  it('показывает сначала 6 карточек и добавляет следующие 6 после задержки', () => {
    renderSection(createItems(18))

    expect(screen.getAllByTestId('recommended-card')).toHaveLength(6)
    expect(observeMock).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    intersectSentinel()

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getAllByTestId('recommended-card')).toHaveLength(6)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('recommended-card')).toHaveLength(12)
  })

  it('не показывает повторяющиеся карточки и прекращает загрузку после окончания данных', () => {
    renderSection(createItems(13))

    intersectSentinel()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    intersectSentinel()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    const cardIds = screen.getAllByTestId('recommended-card').map((card) => card.textContent)

    expect(cardIds).toHaveLength(13)
    expect(new Set(cardIds).size).toBe(13)
    expect(disconnectMock).toHaveBeenCalled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('не перемешивает уже показанные карточки при повторном рендере', () => {
    const items = createItems(12)

    const { rerender } = renderSection(items)

    const initialCardIds = screen.getAllByTestId('recommended-card').map((card) => card.textContent)
    const shuffleCallsCount = vi.mocked(Math.random).mock.calls.length

    rerender(
      <RecommendedSection
        items={items.map((item) => ({
          ...item,
          likesCount: item.likesCount + 1,
        }))}
        onFavoriteClick={vi.fn()}
        onDetailsClick={vi.fn()}
      />,
    )

    const cardIdsAfterRerender = screen
      .getAllByTestId('recommended-card')
      .map((card) => card.textContent)

    expect(cardIdsAfterRerender).toEqual(initialCardIds)
    expect(Math.random).toHaveBeenCalledTimes(shuffleCallsCount)
  })

  it('отключает observer и очищает таймер при размонтировании', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
    const { unmount } = renderSection(createItems(12))

    intersectSentinel()

    expect(screen.getByRole('status')).toBeInTheDocument()

    unmount()

    expect(disconnectMock).toHaveBeenCalled()
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
