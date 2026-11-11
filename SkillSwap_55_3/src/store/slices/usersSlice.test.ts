import { beforeEach, describe, expect, it, vi } from 'vitest'
import usersReducer, {
  selectSimilarUsers,
  fetchUsers,
  selectAllUsers,
  selectCatalogUsers,
  selectCurrentUser,
  selectEffectiveLearningSubcategoryIds,
  selectEffectiveLikesCount,
  selectNewUsers,
  selectPopularUsers,
  selectUserById,
  type UsersState,
} from './usersSlice'
import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { User, CatalogFilters, CatalogSort } from '@/shared/types'
import type { RootState } from '@/store'

const mockUser: User = {
  id: 'user-001',
  name: 'Юлия',
  birthDate: '2002-02-04',
  gender: 'female',
  cityId: 'moscow',
  avatarUrl: null,
  description: 'Тест',
  offeredSkill: {
    title: 'Тест',
    categoryId: 'business-career',
    subcategoryId: 'team-management',
    description: 'Тест',
    imageUrls: [],
  },
  learningSubcategoryIds: [],
  likesCount: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
}

const localUser: User = {
  ...mockUser,
  id: 'local-user',
  name: 'Локальный пользователь',
}

const initialState: UsersState = {
  mockUsers: [],
  localUser: null,
  status: 'idle',
  error: null,
}

// Создаёт состояние Redux для проверки селекторов usersSlice.
function createRootState(users: UsersState): RootState {
  return {
    users,
    favorites: {
      favoriteUserIds: [],
    },
  } as unknown as RootState
}

// Создаёт состояние Redux с авторизованным пользователем.
function createAuthenticatedRootState(users: UsersState, userId: string): RootState {
  return {
    ...createRootState(users),
    auth: {
      account: null,
      session: { userId },
      status: 'idle',
      error: null,
    },
  } as unknown as RootState
}

function createRootStateWithFavorites(users: UsersState, favoriteUserIds: string[]): RootState {
  return {
    ...createRootState(users),
    favorites: { favoriteUserIds },
  } as unknown as RootState
}

beforeEach(() => {
  storageService.remove(STORAGE_KEYS.LOCAL_USER)
})

describe('usersSlice — fetchUsers', () => {
  it('ставит status "loading" при pending и не трогает уже загруженных пользователей', () => {
    const stateWithUsers: UsersState = { ...initialState, mockUsers: [mockUser] }
    const nextState = usersReducer(stateWithUsers, fetchUsers.pending('', undefined))

    expect(nextState.status).toBe('loading')
    expect(nextState.error).toBeNull()
    expect(nextState.mockUsers).toEqual([mockUser])
  })

  it('сохраняет пользователей в mockUsers и ставит status "success" при fulfilled', () => {
    const nextState = usersReducer(initialState, fetchUsers.fulfilled([mockUser], '', undefined))

    expect(nextState.status).toBe('success')
    expect(nextState.mockUsers).toEqual([mockUser])
  })

  it('при rejected сохраняет ошибку, ставит status "error" и не затирает mockUsers', () => {
    const stateWithUsers: UsersState = { ...initialState, mockUsers: [mockUser] }
    const error = new Error('Network Error')
    const nextState = usersReducer(stateWithUsers, fetchUsers.rejected(error, '', undefined))

    expect(nextState.status).toBe('error')
    expect(nextState.error).toBe('Network Error')
    expect(nextState.mockUsers).toEqual([mockUser])
  })
})

describe('usersSlice — localUser', () => {
  it('восстанавливает локального пользователя из localStorage', async () => {
    storageService.set(STORAGE_KEYS.LOCAL_USER, localUser)
    vi.resetModules()

    const { default: freshUsersReducer } = await import('./usersSlice')
    const state = freshUsersReducer(undefined, { type: 'unknown' })

    expect(state.localUser).toEqual(localUser)
  })

  it('объединяет моковых и локального пользователя', () => {
    const state = createRootState({
      ...initialState,
      mockUsers: [mockUser],
      localUser,
    })

    expect(selectAllUsers(state)).toEqual([mockUser, localUser])
    expect(state.users.mockUsers).toEqual([mockUser])
    expect(state.users.localUser).toEqual(localUser)
  })

  it('возвращает только моковых пользователей, если локального пользователя нет', () => {
    const state = createRootState({
      ...initialState,
      mockUsers: [mockUser],
    })

    expect(selectAllUsers(state)).toEqual([mockUser])
  })

  it('не дублирует локального пользователя при совпадении id', () => {
    const duplicateLocalUser: User = {
      ...mockUser,
      name: 'Локальный пользователь',
    }

    const state = createRootState({
      ...initialState,
      mockUsers: [mockUser],
      localUser: duplicateLocalUser,
    })

    expect(selectAllUsers(state)).toEqual([duplicateLocalUser])
    expect(state.users.mockUsers).toEqual([mockUser])
    expect(state.users.localUser).toEqual(duplicateLocalUser)
  })
})

describe('usersSlice — базовые селекторы', () => {
  it('возвращает текущего локального пользователя по id активной сессии', () => {
    const state = createAuthenticatedRootState(
      {
        ...initialState,
        localUser,
      },
      localUser.id,
    )

    expect(selectCurrentUser(state)).toEqual(localUser)
  })

  it('не возвращает локального пользователя при несовпадении id сессии', () => {
    const state = createAuthenticatedRootState(
      {
        ...initialState,
        localUser,
      },
      'another-user',
    )

    expect(selectCurrentUser(state)).toBeNull()
  })

  it('находит мокового и локального пользователя по id', () => {
    const state = createRootState({
      ...initialState,
      mockUsers: [mockUser],
      localUser,
    })

    expect(selectUserById(state, mockUser.id)).toEqual(mockUser)
    expect(selectUserById(state, localUser.id)).toEqual(localUser)
    expect(selectUserById(state, 'unknown-user')).toBeNull()
  })

  it('сортирует пользователей по количеству лайков', () => {
    const lessPopularUser: User = {
      ...mockUser,
      id: 'less-popular-user',
      likesCount: 5,
    }

    const morePopularUser: User = {
      ...mockUser,
      id: 'more-popular-user',
      likesCount: 20,
    }

    const state = createRootState({
      ...initialState,
      mockUsers: [lessPopularUser, morePopularUser],
    })

    expect(selectPopularUsers(state)).toEqual([morePopularUser, lessPopularUser])
    expect(state.users.mockUsers).toEqual([lessPopularUser, morePopularUser])
  })

  it('сортирует пользователей по дате создания от новых к старым', () => {
    const olderUser: User = {
      ...mockUser,
      id: 'older-user',
      createdAt: '2024-01-01T00:00:00.000Z',
    }

    const newerUser: User = {
      ...mockUser,
      id: 'newer-user',
      createdAt: '2025-01-01T00:00:00.000Z',
    }

    const state = createRootState({
      ...initialState,
      mockUsers: [olderUser, newerUser],
    })

    expect(selectNewUsers(state)).toEqual([newerUser, olderUser])
    expect(state.users.mockUsers).toEqual([olderUser, newerUser])
  })

  it('не возвращает пользователя при отсутствии активной сессии', () => {
    const state = {
      ...createRootState({
        ...initialState,
        localUser,
      }),
      auth: {
        account: null,
        session: null,
        status: 'idle',
        error: null,
      },
    } as unknown as RootState

    expect(selectCurrentUser(state)).toBeNull()
  })

  it('сразу пересортировывает пользователей после изменения Favorites', () => {
    const firstUser: User = {
      ...mockUser,
      id: 'first-user',
      likesCount: 10,
    }

    const secondUser: User = {
      ...mockUser,
      id: 'second-user',
      likesCount: 10,
    }

    const stateWithoutFavorite = createRootStateWithFavorites(
      { ...initialState, mockUsers: [firstUser, secondUser] },
      [],
    )

    const stateWithFavorite = createRootStateWithFavorites(
      { ...initialState, mockUsers: [firstUser, secondUser] },
      [secondUser.id],
    )

    expect(selectPopularUsers(stateWithoutFavorite)).toEqual([firstUser, secondUser])
    expect(selectPopularUsers(stateWithFavorite)).toEqual([secondUser, firstUser])
  })
})

describe('usersSlice — selectEffectiveLikesCount', () => {
  // Добавляет к состоянию из createRootState срез favorites — нужен для
  // проверки вычисляемого likesCount, который зависит от users + favorites.

  it('возвращает базовый likesCount, если пользователь не в Favorites', () => {
    const state = createRootStateWithFavorites(
      { ...initialState, mockUsers: [{ ...mockUser, likesCount: 10 }] },
      [],
    )
    expect(selectEffectiveLikesCount(state, mockUser.id)).toBe(10)
  })

  it('прибавляет 1 к likesCount, если пользователь в Favorites', () => {
    const state = createRootStateWithFavorites(
      { ...initialState, mockUsers: [{ ...mockUser, likesCount: 10 }] },
      [mockUser.id],
    )
    expect(selectEffectiveLikesCount(state, mockUser.id)).toBe(11)
  })

  it('возвращает базовый likesCount после удаления пользователя из Favorites', () => {
    const stateWithFavorite = createRootStateWithFavorites(
      { ...initialState, mockUsers: [{ ...mockUser, likesCount: 10 }] },
      [mockUser.id],
    )
    expect(selectEffectiveLikesCount(stateWithFavorite, mockUser.id)).toBe(11)

    const stateWithoutFavorite = createRootStateWithFavorites(
      { ...initialState, mockUsers: [{ ...mockUser, likesCount: 10 }] },
      [],
    )
    expect(selectEffectiveLikesCount(stateWithoutFavorite, mockUser.id)).toBe(10)
  })

  it('возвращает 0, если пользователь не найден', () => {
    const state = createRootStateWithFavorites(initialState, [])
    expect(selectEffectiveLikesCount(state, 'unknown-user')).toBe(0)
  })

  it('у локального пользователя базовый likesCount 0 (сам себя в Favorites не добавить)', () => {
    const state = createRootStateWithFavorites(
      { ...initialState, localUser: { ...localUser, likesCount: 0 } },
      [],
    )
    expect(selectEffectiveLikesCount(state, localUser.id)).toBe(0)
  })
})

describe('usersSlice — selectEffectiveLearningSubcategoryIds', () => {
  // Создаёт состояние Redux со срезом Favorites.

  const firstFavoriteUser: User = {
    ...mockUser,
    id: 'favorite-user-1',
    offeredSkill: {
      ...mockUser.offeredSkill,
      subcategoryId: 'public-speaking',
    },
  }

  const secondFavoriteUser: User = {
    ...mockUser,
    id: 'favorite-user-2',
    offeredSkill: {
      ...mockUser.offeredSkill,
      subcategoryId: 'time-management',
    },
  }

  it('для мокового пользователя возвращает исходный learningSubcategoryIds без изменений', () => {
    const mockUserWithLearningIds: User = {
      ...mockUser,
      learningSubcategoryIds: ['guitar'],
    }

    const state = createRootStateWithFavorites(
      {
        ...initialState,
        mockUsers: [mockUserWithLearningIds, firstFavoriteUser],
      },
      [firstFavoriteUser.id],
    )

    expect(selectEffectiveLearningSubcategoryIds(state, mockUserWithLearningIds.id)).toEqual([
      'guitar',
    ])
  })

  it('у локального пользователя без Favorites возвращает только базовый список', () => {
    const state = createRootStateWithFavorites(
      {
        ...initialState,
        localUser: {
          ...localUser,
          learningSubcategoryIds: ['guitar'],
        },
      },
      [],
    )

    expect(selectEffectiveLearningSubcategoryIds(state, localUser.id)).toEqual(['guitar'])
  })

  it('добавляет subcategoryId избранного пользователя к базовому списку', () => {
    const state = createRootStateWithFavorites(
      {
        ...initialState,
        mockUsers: [firstFavoriteUser],
        localUser: {
          ...localUser,
          learningSubcategoryIds: ['guitar'],
        },
      },
      [firstFavoriteUser.id],
    )

    expect(selectEffectiveLearningSubcategoryIds(state, localUser.id)).toEqual([
      'guitar',
      'public-speaking',
    ])
  })

  it('после удаления пользователя из Favorites список возвращается к базовому', () => {
    const usersState: UsersState = {
      ...initialState,
      mockUsers: [firstFavoriteUser],
      localUser: {
        ...localUser,
        learningSubcategoryIds: ['guitar'],
      },
    }

    const stateWithFavorite = createRootStateWithFavorites(usersState, [firstFavoriteUser.id])

    expect(selectEffectiveLearningSubcategoryIds(stateWithFavorite, localUser.id)).toEqual([
      'guitar',
      'public-speaking',
    ])

    const stateWithoutFavorite = createRootStateWithFavorites(usersState, [])

    expect(selectEffectiveLearningSubcategoryIds(stateWithoutFavorite, localUser.id)).toEqual([
      'guitar',
    ])
  })

  it('убирает дубликаты подкатегорий', () => {
    const duplicateFavoriteUser: User = {
      ...mockUser,
      id: 'favorite-user-3',
      offeredSkill: {
        ...mockUser.offeredSkill,
        subcategoryId: 'public-speaking',
      },
    }

    const state = createRootStateWithFavorites(
      {
        ...initialState,
        mockUsers: [firstFavoriteUser, secondFavoriteUser, duplicateFavoriteUser],
        localUser: {
          ...localUser,
          learningSubcategoryIds: ['time-management'],
        },
      },
      [firstFavoriteUser.id, secondFavoriteUser.id, duplicateFavoriteUser.id],
    )

    expect(selectEffectiveLearningSubcategoryIds(state, localUser.id)).toEqual([
      'time-management',
      'public-speaking',
    ])
  })

  it('возвращает пустой массив, если пользователь не найден', () => {
    const state = createRootStateWithFavorites(initialState, [])

    expect(selectEffectiveLearningSubcategoryIds(state, 'unknown-user')).toEqual([])
  })
})

describe('usersSlice — selectCatalogUsers', () => {
  const defaultCatalogFilters: CatalogFilters = {
    offerType: 'all',
    gender: 'all',
    subcategoryIds: [],
    cityIds: [],
  }

  // Создаёт пользователя каталога на основе общего mockUser.
  function createCatalogUser(id: string, overrides: Partial<User> = {}): User {
    return {
      ...mockUser,
      ...overrides,
      id,
      offeredSkill: {
        ...mockUser.offeredSkill,
        ...overrides.offeredSkill,
      },
    }
  }

  // Создаёт минимальное состояние Redux для проверки итогового селектора каталога.
  function createCatalogRootState({
    mockUsers,
    localUser = null,
    favoriteUserIds = [],
    filters = defaultCatalogFilters,
    sort = 'default',
  }: {
    mockUsers: User[]
    localUser?: User | null
    favoriteUserIds?: string[]
    filters?: CatalogFilters
    sort?: CatalogSort
  }): RootState {
    return {
      users: {
        mockUsers,
        localUser,
        status: 'success',
        error: null,
      },
      favorites: { favoriteUserIds },
      catalogFilters: { filters, sort },
    } as RootState
  }

  it('в режиме all ищет выбранные подкатегории и в offeredSkill, и в «Хочу научиться»', () => {
    const teachingMatch = createCatalogUser('teaching-match', {
      offeredSkill: {
        ...mockUser.offeredSkill,
        subcategoryId: 'guitar',
      },
      learningSubcategoryIds: [],
    })
    const learningMatch = createCatalogUser('learning-match', {
      offeredSkill: {
        ...mockUser.offeredSkill,
        subcategoryId: 'drawing',
      },
      learningSubcategoryIds: ['english'],
    })
    const noMatch = createCatalogUser('no-match', {
      offeredSkill: {
        ...mockUser.offeredSkill,
        subcategoryId: 'cooking',
      },
      learningSubcategoryIds: ['public-speaking'],
    })
    const state = createCatalogRootState({
      mockUsers: [teachingMatch, learningMatch, noMatch],
      filters: {
        offerType: 'all',
        gender: 'all',
        subcategoryIds: ['guitar', 'english'],
        cityIds: [],
      },
    })

    expect(selectCatalogUsers(state)).toEqual([teachingMatch, learningMatch])
  })

  it('в режиме teaching проверяет подкатегорию только в offeredSkill', () => {
    const teachesGuitar = createCatalogUser('teaches-guitar', {
      offeredSkill: {
        ...mockUser.offeredSkill,
        subcategoryId: 'guitar',
      },
      learningSubcategoryIds: [],
    })
    const learnsGuitar = createCatalogUser('learns-guitar', {
      learningSubcategoryIds: ['guitar'],
    })
    const state = createCatalogRootState({
      mockUsers: [teachesGuitar, learnsGuitar],
      filters: {
        offerType: 'teaching',
        gender: 'all',
        subcategoryIds: ['guitar'],
        cityIds: [],
      },
    })

    expect(selectCatalogUsers(state)).toEqual([teachesGuitar])
  })

  it('в режиме learning проверяет подкатегорию только в «Хочу научиться»', () => {
    const teachesGuitar = createCatalogUser('teaches-guitar', {
      offeredSkill: {
        ...mockUser.offeredSkill,
        subcategoryId: 'guitar',
      },
      learningSubcategoryIds: [],
    })
    const learnsGuitar = createCatalogUser('learns-guitar', {
      learningSubcategoryIds: ['guitar'],
    })
    const state = createCatalogRootState({
      mockUsers: [teachesGuitar, learnsGuitar],
      filters: {
        offerType: 'learning',
        gender: 'all',
        subcategoryIds: ['guitar'],
        cityIds: [],
      },
    })

    expect(selectCatalogUsers(state)).toEqual([learnsGuitar])
  })

  it('объединяет несколько выбранных городов по правилу OR', () => {
    const moscowUser = createCatalogUser('moscow-user', {
      cityId: 'moscow',
    })
    const kazanUser = createCatalogUser('kazan-user', {
      cityId: 'kazan',
    })
    const petersburgUser = createCatalogUser('petersburg-user', {
      cityId: 'saint-petersburg',
    })
    const state = createCatalogRootState({
      mockUsers: [moscowUser, kazanUser, petersburgUser],
      filters: {
        ...defaultCatalogFilters,
        cityIds: ['moscow', 'kazan'],
      },
    })

    expect(selectCatalogUsers(state)).toEqual([moscowUser, kazanUser])
  })

  it('объединяет подкатегорию, город и пол по правилу AND', () => {
    const fullMatch = createCatalogUser('full-match', {
      gender: 'female',
      cityId: 'moscow',
      offeredSkill: {
        ...mockUser.offeredSkill,
        subcategoryId: 'guitar',
      },
    })
    const wrongCity = createCatalogUser('wrong-city', {
      gender: 'female',
      cityId: 'kazan',
      offeredSkill: {
        ...mockUser.offeredSkill,
        subcategoryId: 'guitar',
      },
    })
    const wrongGender = createCatalogUser('wrong-gender', {
      gender: 'male',
      cityId: 'moscow',
      offeredSkill: {
        ...mockUser.offeredSkill,
        subcategoryId: 'guitar',
      },
    })
    const wrongSubcategory = createCatalogUser('wrong-subcategory', {
      gender: 'female',
      cityId: 'moscow',
      offeredSkill: {
        ...mockUser.offeredSkill,
        subcategoryId: 'drawing',
      },
    })
    const state = createCatalogRootState({
      mockUsers: [fullMatch, wrongCity, wrongGender, wrongSubcategory],
      filters: {
        offerType: 'teaching',
        gender: 'female',
        subcategoryIds: ['guitar'],
        cityIds: ['moscow'],
      },
    })

    expect(selectCatalogUsers(state)).toEqual([fullMatch])
  })

  it('учитывает вычисляемую подкатегорию локального пользователя из Favorites', () => {
    const favoriteUser = createCatalogUser('favorite-user', {
      offeredSkill: {
        ...mockUser.offeredSkill,
        subcategoryId: 'guitar',
      },
      learningSubcategoryIds: [],
    })
    const currentLocalUser = createCatalogUser('local-user', {
      name: 'Локальный пользователь',
      learningSubcategoryIds: [],
    })
    const state = createCatalogRootState({
      mockUsers: [favoriteUser],
      localUser: currentLocalUser,
      favoriteUserIds: [favoriteUser.id],
      filters: {
        offerType: 'learning',
        gender: 'all',
        subcategoryIds: ['guitar'],
        cityIds: [],
      },
    })

    expect(selectCatalogUsers(state)).toEqual([currentLocalUser])
  })

  it('сначала фильтрует пользователей, затем сортирует совпавших от новых к старым', () => {
    const olderMatch = createCatalogUser('older-match', {
      gender: 'female',
      createdAt: '2024-01-01T00:00:00.000Z',
    })
    const excludedNewestUser = createCatalogUser('excluded-newest-user', {
      gender: 'male',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    const newerMatch = createCatalogUser('newer-match', {
      gender: 'female',
      createdAt: '2025-01-01T00:00:00.000Z',
    })
    const originalUsers = [olderMatch, excludedNewestUser, newerMatch]
    const state = createCatalogRootState({
      mockUsers: originalUsers,
      filters: {
        ...defaultCatalogFilters,
        gender: 'female',
      },
      sort: 'newest',
    })

    expect(selectCatalogUsers(state)).toEqual([newerMatch, olderMatch])
    expect(state.users.mockUsers).toEqual(originalUsers)
  })

  it('при сортировке default сохраняет исходный порядок пользователей', () => {
    const firstUser = createCatalogUser('first-user', {
      createdAt: '2024-01-01T00:00:00.000Z',
    })
    const secondUser = createCatalogUser('second-user', {
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    const state = createCatalogRootState({
      mockUsers: [firstUser, secondUser],
    })

    expect(selectCatalogUsers(state)).toEqual([firstUser, secondUser])
  })

  it('возвращает тот же результат при неизменившихся входных данных', () => {
    const state = createCatalogRootState({
      mockUsers: [createCatalogUser('first-user')],
    })
    const firstResult = selectCatalogUsers(state)
    const secondResult = selectCatalogUsers(state)

    expect(secondResult).toBe(firstResult)
  })
})

describe('usersSlice — selectSimilarUsers', () => {
  // Создаёт пользователя с нужной категорией и подкатегорией.
  function createSimilarUser(id: string, categoryId: string, subcategoryId: string): User {
    return {
      ...mockUser,
      id,
      offeredSkill: {
        ...mockUser.offeredSkill,
        categoryId,
        subcategoryId,
      },
    }
  }

  it('исключает текущего пользователя из похожих предложений', () => {
    const currentUser = createSimilarUser('current-user', 'business-career', 'team-management')

    const similarUser = createSimilarUser('similar-user', 'business-career', 'team-management')

    const state = createRootState({
      ...initialState,
      mockUsers: [currentUser, similarUser],
    })

    const result = selectSimilarUsers(state, currentUser.id)

    expect(result).toEqual([similarUser])
    expect(result).not.toContain(currentUser)
  })

  it('сначала возвращает пользователей с той же подкатегорией', () => {
    const currentUser = createSimilarUser('current-user', 'business-career', 'team-management')

    const sameSubcategoryUser = createSimilarUser(
      'same-subcategory',
      'business-career',
      'team-management',
    )

    const otherSubcategoryUser = createSimilarUser(
      'other-subcategory',
      'business-career',
      'time-management',
    )

    const state = createRootState({
      ...initialState,
      mockUsers: [currentUser, otherSubcategoryUser, sameSubcategoryUser],
    })

    const result = selectSimilarUsers(state, currentUser.id)

    expect(result).toEqual([sameSubcategoryUser, otherSubcategoryUser])
  })

  it('если пользователей с той же подкатегорией меньше 8, добирает из той же категории', () => {
    const currentUser = createSimilarUser('current-user', 'business-career', 'team-management')

    const sameSubcategoryUser = createSimilarUser(
      'same-subcategory',
      'business-career',
      'team-management',
    )

    const otherSubcategoryUser = createSimilarUser(
      'other-subcategory',
      'business-career',
      'time-management',
    )

    const anotherCategoryUser = createSimilarUser(
      'another-category',
      'foreign-languages',
      'english',
    )

    const state = createRootState({
      ...initialState,
      mockUsers: [currentUser, sameSubcategoryUser, otherSubcategoryUser, anotherCategoryUser],
    })

    const result = selectSimilarUsers(state, currentUser.id)

    expect(result).toEqual([sameSubcategoryUser, otherSubcategoryUser])

    expect(result).not.toContain(anotherCategoryUser)
  })

  it('не добавляет пользователей из другой категории', () => {
    const currentUser = createSimilarUser('current-user', 'business-career', 'team-management')

    const wrongCategoryUser = createSimilarUser('wrong-category', 'foreign-languages', 'english')

    const state = createRootState({
      ...initialState,
      mockUsers: [currentUser, wrongCategoryUser],
    })

    const result = selectSimilarUsers(state, currentUser.id)

    expect(result).toEqual([])
  })

  it('ограничивает результат максимум 8 пользователями', () => {
    const currentUser = createSimilarUser('current-user', 'business-career', 'team-management')
    const similarUsers = Array.from({ length: 10 }, (_, index) =>
      createSimilarUser(`similar-user-${index + 1}`, 'business-career', 'team-management'),
    )

    const state = createRootState({
      ...initialState,
      mockUsers: [currentUser, ...similarUsers],
    })

    const result = selectSimilarUsers(state, currentUser.id)

    expect(result).toHaveLength(8)
    expect(result).toEqual(similarUsers.slice(0, 8))
  })

  it('если подходящих пользователей нет, возвращает пустой массив', () => {
    const currentUser = createSimilarUser('current-user', 'business-career', 'team-management')

    const unrelatedUser = createSimilarUser('unrelated-user', 'foreign-languages', 'english')

    const state = createRootState({
      ...initialState,
      mockUsers: [currentUser, unrelatedUser],
    })

    const result = selectSimilarUsers(state, currentUser.id)

    expect(result).toEqual([])
  })

  it('если текущий пользователь не найден, возвращает пустой массив', () => {
    const user = createSimilarUser('user-1', 'business-career', 'team-management')

    const state = createRootState({
      ...initialState,
      mockUsers: [user],
    })

    const result = selectSimilarUsers(state, 'unknown-user')

    expect(result).toEqual([])
  })
})
