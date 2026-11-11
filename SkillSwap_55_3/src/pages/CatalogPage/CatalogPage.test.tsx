import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import authReduser from '@/store/slices/authSlice'
import { MemoryRouter } from 'react-router-dom'

import catalogFiltersReducer, {
  defaultFilters,
  defaultSort,
  type CatalogFiltersState,
} from '@/store/slices/catalogFiltersSlice'
import usersReducer, { type UsersState } from '@/store/slices/usersSlice'
import favoritesReducer from '@/store/slices/favoritesSlice'
import type { Category, City, User } from '@/shared/types'
import type { UserSkillsSectionProps } from '@/widgets/UserSkillsSection'

import { CatalogPage } from './CatalogPage'

/**vi.mock('@/widgets/Header', () => ({
  HeaderContainer: ({
    searchQuery = '',
    onSearchChange,
  }: {
    searchQuery?: string
    onSearchChange?: (value: string) => void
  }) => (
    <input
      type="search"
      aria-label="Поиск по навыкам"
      value={searchQuery}
      onChange={(event) => onSearchChange?.(event.target.value)}
    />
  ),
}))**/
vi.mock('@/widgets/Footer', () => ({ Footer: () => null }))
vi.mock('@/widgets/FiltersSidebar', () => ({ FiltersSidebar: () => null }))
vi.mock('@/widgets/RecommendedSection', () => ({
  RecommendedSection: () => null,
}))
vi.mock('@/widgets/AppliedFiltersBar', () => ({ AppliedFiltersBar: () => null }))
vi.mock('@/widgets/SortButton', () => ({ SortButton: () => null }))
vi.mock('@/widgets/UserSkillCard', () => ({
  UserSkillCard: ({ user }: { user: User }) => (
    <article>
      <span>{user.name}</span>
    </article>
  ),
}))
vi.mock('@/widgets/UserSkillsSection', () => ({
  UserSkillsSection: ({
    title,
    items,
    showViewAll,
    viewAllLabel,
    onViewAllClick,
  }: UserSkillsSectionProps) => (
    <section aria-label={title}>
      {items.map((item) => (
        <span key={item.id} data-testid="new-user-card">
          {item.name}
        </span>
      ))}

      {showViewAll && (
        <button type="button" onClick={onViewAllClick}>
          {viewAllLabel}
        </button>
      )}
    </section>
  ),
}))

const categories: Category[] = [
  {
    id: 'business-career',
    name: 'Бизнес и карьера',
    subcategories: [
      {
        id: 'team-management',
        name: 'Управление командой',
      },
    ],
  },
]

const cities: City[] = [{ id: 'moscow', name: 'Москва' }]

const baseUser: User = {
  id: 'user-001',
  name: 'Пользователь 1',
  birthDate: '2000-01-01',
  gender: 'female',
  cityId: 'moscow',
  avatarUrl: null,
  description: 'Тестовый пользователь',
  offeredSkill: {
    title: 'Управление командой',
    categoryId: 'business-career',
    subcategoryId: 'team-management',
    description: 'Тестовое описание',
    imageUrls: [],
  },
  learningSubcategoryIds: [],
  likesCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
}

function createUser(index: number): User {
  const day = String(index + 1).padStart(2, '0')

  return {
    ...baseUser,
    id: `user-${index + 1}`,
    name: `Пользователь ${index + 1}`,
    createdAt: `2026-01-${day}T00:00:00.000Z`,
  }
}

function renderCatalogPage(
  mockUsers: User[],
  localUser: User | null = null,
  catalogFiltersState: CatalogFiltersState = {
    filters: defaultFilters,
    sort: defaultSort,
  },
) {
  const users = localUser
    ? [...mockUsers.filter((user) => user.id !== localUser.id), localUser]
    : mockUsers

  const testStore = configureStore({
    reducer: {
      users: usersReducer,
      auth: authReduser,
      catalogFilters: catalogFiltersReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      users: {
        mockUsers,
        localUser,
        status: 'success' as const,
        error: null,
      },
      catalogFilters: catalogFiltersState,
      favorites: {
        favoriteUserIds: [],
      },
    },
  })

  const renderResult = render(
    <MemoryRouter>
      <Provider store={testStore}>
        <CatalogPage
          users={users}
          categories={categories}
          cities={cities}
          usersStatus="success"
          usersError={null}
          hasMockUsers={mockUsers.length > 0}
          onRetry={vi.fn()}
          onFavoriteClick={vi.fn()}
          onDetailsClick={vi.fn()}
        />
      </Provider>
    </MemoryRouter>,
  )

  return {
    testStore,
    ...renderResult,
  }
}

function renderCatalogState({
  mockUsers = [],
  localUser = null,
  status,
  error = null,
  onRetry = vi.fn(),
}: {
  mockUsers?: User[]
  localUser?: User | null
  status: UsersState['status']
  error?: string | null
  onRetry?: () => void
}) {
  const users = localUser
    ? [...mockUsers.filter((user) => user.id !== localUser.id), localUser]
    : mockUsers

  const testStore = configureStore({
    reducer: {
      users: usersReducer,
      auth: authReduser,
      catalogFilters: catalogFiltersReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      users: {
        mockUsers,
        localUser,
        status,
        error,
      },
      catalogFilters: {
        filters: defaultFilters,
        sort: defaultSort,
      },
      favorites: {
        favoriteUserIds: [],
      },
    },
  })

  render(
    <MemoryRouter>
    <Provider store={testStore}>
      <CatalogPage
        users={users}
        categories={categories}
        cities={cities}
        usersStatus={status}
        usersError={error}
        hasMockUsers={mockUsers.length > 0}
        onRetry={onRetry}
        onFavoriteClick={vi.fn()}
        onDetailsClick={vi.fn()}
      />
    </Provider>
    </MemoryRouter>,
  )

  return { testStore }
}

describe('CatalogPage — секция «Популярное»', () => {
  it('показывает 3 карточки, раскрывает до 9 и сворачивает обратно', async () => {
    const user = userEvent.setup()
    const users = Array.from({ length: 10 }, (_, index) => ({
      ...createUser(index),
      likesCount: 100 - index,
    }))

    renderCatalogPage(users)

    const popularSection = screen.getByRole('region', { name: 'Популярное' })

    expect(within(popularSection).getAllByTestId('new-user-card')).toHaveLength(3)

    await user.click(
      within(popularSection).getByRole('button', {
        name: 'Смотреть все',
      }),
    )

    expect(within(popularSection).getAllByTestId('new-user-card')).toHaveLength(9)
    expect(
      within(popularSection).getByRole('button', {
        name: 'Свернуть',
      }),
    ).toBeInTheDocument()

    await user.click(
      within(popularSection).getByRole('button', {
        name: 'Свернуть',
      }),
    )

    expect(within(popularSection).getAllByTestId('new-user-card')).toHaveLength(3)
  })

  it('не показывает кнопку раскрытия, если пользователей не больше трёх', () => {
    renderCatalogPage([createUser(0), createUser(1), createUser(2)])

    const popularSection = screen.getByRole('region', { name: 'Популярное' })

    expect(
      within(popularSection).queryByRole('button', {
        name: 'Смотреть все',
      }),
    ).not.toBeInTheDocument()
  })
})

describe('CatalogPage — секция «Новое»', () => {
  it('показывает 3 карточки, раскрывает до 9 и сворачивает обратно', async () => {
    const user = userEvent.setup()

    renderCatalogPage(Array.from({ length: 10 }, (_, index) => createUser(index)))

    const newSection = screen.getByRole('region', { name: 'Новое' })

    expect(within(newSection).getAllByTestId('new-user-card')).toHaveLength(3)

    await user.click(
      within(newSection).getByRole('button', {
        name: 'Смотреть все',
      }),
    )

    expect(within(newSection).getAllByTestId('new-user-card')).toHaveLength(9)

    expect(
      within(newSection).getByRole('button', {
        name: 'Свернуть',
      }),
    ).toBeInTheDocument()

    await user.click(
      within(newSection).getByRole('button', {
        name: 'Свернуть',
      }),
    )

    expect(within(newSection).getAllByTestId('new-user-card')).toHaveLength(3)
  })

  it('показывает локально зарегистрированного пользователя среди новейших', () => {
    const localUser: User = {
      ...baseUser,
      id: 'local-user',
      name: 'Локальный пользователь',
      createdAt: '2026-02-01T00:00:00.000Z',
    }

    renderCatalogPage([createUser(0), createUser(1), createUser(2)], localUser)

    const newSection = screen.getByRole('region', { name: 'Новое' })

    expect(within(newSection).getByText('Локальный пользователь')).toBeInTheDocument()
  })
})

describe('CatalogPage — loading/error states', () => {
  it('показывает Spinner уже в idle до запуска первоначального thunk', () => {
    renderCatalogState({
      status: 'idle',
    })

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByLabelText('Загрузка...')).toBeInTheDocument()
  })

  it('показывает Spinner при первой загрузке, даже если существует локальный пользователь', () => {
    const localUser: User = {
      ...baseUser,
      id: 'local-user',
      name: 'Локальный пользователь',
    }

    renderCatalogState({
      localUser,
      status: 'loading',
    })

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByLabelText('Загрузка...')).toBeInTheDocument()
  })

  it('не показывает Spinner при повторной загрузке уже имеющихся моковых пользователей', () => {
    renderCatalogState({
      mockUsers: [baseUser],
      status: 'loading',
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    expect(screen.getByRole('region', { name: 'Популярное' })).toBeInTheDocument()
  })

  it('показывает ошибку и retry, если первая загрузка упала при наличии локального пользователя', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    const localUser: User = {
      ...baseUser,
      id: 'local-user',
      name: 'Локальный пользователь',
    }

    renderCatalogState({
      localUser,
      status: 'error',
      error: 'Network Error',
      onRetry,
    })

    expect(screen.getByText('Не удалось загрузить пользователей')).toBeInTheDocument()

    expect(screen.getByText('Network Error')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Повторить' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('показывает error-state после ошибки повторного запроса и сохраняет данные в Redux', () => {
    const { testStore } = renderCatalogState({
      mockUsers: [baseUser],
      status: 'error',
      error: 'Network Error',
    })

    expect(screen.getByText('Не удалось загрузить пользователей')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument()

    expect(testStore.getState().users.mockUsers).toEqual([baseUser])
  })
})

describe('CatalogPage — поиск', () => {
  it('ищет по названию offeredSkill.title', async () => {
    const user = userEvent.setup()

    const users: User[] = [
      {
        ...baseUser,
        id: 'user-design',
        name: 'Анна',
        offeredSkill: {
          ...baseUser.offeredSkill,
          title: 'Веб-дизайн',
        },
      },
      {
        ...baseUser,
        id: 'user-python',
        name: 'Иван',
        offeredSkill: {
          ...baseUser.offeredSkill,
          title: 'Python',
        },
      },
    ]

    renderCatalogPage(users)

    const searchInput = screen.getByRole('searchbox', {
      name: 'Поиск по навыкам',
    })

    await user.type(searchInput, 'дизайн')

    expect(screen.getByText('Анна')).toBeInTheDocument()
    expect(screen.queryByText('Иван')).not.toBeInTheDocument()
  })

  it('ищет без учёта регистра и поддерживает частичное совпадение', async () => {
    const user = userEvent.setup()

    const users: User[] = [
      {
        ...baseUser,
        id: 'user-1',
        name: 'Анна',
        offeredSkill: {
          ...baseUser.offeredSkill,
          title: 'Веб-дизайн',
        },
      },
      {
        ...baseUser,
        id: 'user-2',
        name: 'Мария',
        offeredSkill: {
          ...baseUser.offeredSkill,
          title: 'Дизайн интерьера',
        },
      },
      {
        ...baseUser,
        id: 'user-3',
        name: 'Иван',
        offeredSkill: {
          ...baseUser.offeredSkill,
          title: 'Python',
        },
      },
    ]

    renderCatalogPage(users)

    const searchInput = screen.getByRole('searchbox', {
      name: 'Поиск по навыкам',
    })

    await user.type(searchInput, 'ДИЗ')

    expect(screen.getByText('Анна')).toBeInTheDocument()
    expect(screen.getByText('Мария')).toBeInTheDocument()
    expect(screen.queryByText('Иван')).not.toBeInTheDocument()
  })

  it('показывает empty-state, если ничего не найдено', async () => {
    const user = userEvent.setup()

    renderCatalogPage([
      {
        ...baseUser,
        offeredSkill: {
          ...baseUser.offeredSkill,
          title: 'Веб-дизайн',
        },
      },
    ])

    const searchInput = screen.getByRole('searchbox', {
      name: 'Поиск по навыкам',
    })

    await user.type(searchInput, 'Python')

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument()

    expect(
      screen.getByText('Попробуйте изменить параметры поиска или сбросить фильтры'),
    ).toBeInTheDocument()
  })

  it('не показывает empty-state, когда результаты есть', async () => {
    const user = userEvent.setup()

    renderCatalogPage([
      {
        ...baseUser,
        offeredSkill: {
          ...baseUser.offeredSkill,
          title: 'Веб-дизайн',
        },
      },
    ])

    const searchInput = screen.getByRole('searchbox', {
      name: 'Поиск по навыкам',
    })

    await user.type(searchInput, 'дизайн')

    expect(screen.queryByText('Ничего не найдено')).not.toBeInTheDocument()
  })

  it('кнопка «Сбросить» очищает поиск', async () => {
    const user = userEvent.setup()

    renderCatalogPage([
      {
        ...baseUser,
        offeredSkill: {
          ...baseUser.offeredSkill,
          title: 'Веб-дизайн',
        },
      },
    ])

    const searchInput = screen.getByRole('searchbox', {
      name: 'Поиск по навыкам',
    })

    await user.type(searchInput, 'Python')

    expect(searchInput).toHaveValue('Python')

    const resetButton = screen.getByRole('button', {
      name: /сбросить/i,
    })

    await user.click(resetButton)

    expect(searchInput).toHaveValue('')

    expect(screen.queryByText('Ничего не найдено')).not.toBeInTheDocument()
  })

  it('применяет поиск поверх результата фильтрации', async () => {
    const user = userEvent.setup()

    const users: User[] = [
      {
        ...baseUser,
        id: 'female-design',
        name: 'Анна',
        gender: 'female',
        offeredSkill: {
          ...baseUser.offeredSkill,
          title: 'Веб-дизайн',
        },
      },
      {
        ...baseUser,
        id: 'female-python',
        name: 'Мария',
        gender: 'female',
        offeredSkill: {
          ...baseUser.offeredSkill,
          title: 'Python',
        },
      },
      {
        ...baseUser,
        id: 'male-design',
        name: 'Иван',
        gender: 'male',
        offeredSkill: {
          ...baseUser.offeredSkill,
          title: 'Дизайн интерьера',
        },
      },
    ]

    renderCatalogPage(users, null, {
      filters: {
        ...defaultFilters,
        gender: 'female',
      },
      sort: defaultSort,
    })

    await user.type(
      screen.getByRole('searchbox', {
        name: 'Поиск по навыкам',
      }),
      'дизайн',
    )

    expect(screen.getByText('Анна')).toBeInTheDocument()
    expect(screen.queryByText('Мария')).not.toBeInTheDocument()
    expect(screen.queryByText('Иван')).not.toBeInTheDocument()
  })

  it('кнопка «Сбросить» очищает поиск, фильтры и сортировку', async () => {
    const user = userEvent.setup()

    const { testStore } = renderCatalogPage([baseUser], null, {
      filters: {
        offerType: 'teaching',
        gender: 'female',
        subcategoryIds: ['team-management'],
        cityIds: ['moscow'],
      },
      sort: 'newest',
    })

    const searchInput = screen.getByRole('searchbox', {
      name: 'Поиск по навыкам',
    })

    await user.type(searchInput, 'Управление')

    await user.click(
      screen.getByRole('button', {
        name: /сбросить/i,
      }),
    )

    expect(searchInput).toHaveValue('')
    expect(testStore.getState().catalogFilters).toEqual({
      filters: defaultFilters,
      sort: defaultSort,
    })
    expect(screen.getByRole('region', { name: 'Популярное' })).toBeInTheDocument()
  })
})
