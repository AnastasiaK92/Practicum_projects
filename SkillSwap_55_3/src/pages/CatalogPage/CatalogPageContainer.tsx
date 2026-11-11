import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/shared/lib/constants'
import { categories, cities } from '@/shared/config'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addFavorite, removeFavorite, selectFavoriteUserIds } from '@/store/slices/favoritesSlice'
import {
  fetchUsers,
  selectAllUsers,
  selectMockUsers,
  selectUsersError,
  selectUsersStatus,
} from '@/store/slices/usersSlice'

import { CatalogPage } from './CatalogPage'

export function CatalogPageContainer() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const mockUsers = useAppSelector(selectMockUsers)
  const users = useAppSelector(selectAllUsers)
  const favoriteUserIds = useAppSelector(selectFavoriteUserIds)
  const usersStatus = useAppSelector(selectUsersStatus)
  const usersError = useAppSelector(selectUsersError)
  const authSession = useAppSelector((state) => state.auth.session)

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [dispatch, usersStatus])

  const handleFavoriteClick = (userId: string) => {
    // Не позволяет изменить Favorites без активной сессии.
    if (!authSession) {
      return
    }

    if (favoriteUserIds.includes(userId)) {
      dispatch(removeFavorite(userId))
    } else {
      dispatch(addFavorite(userId))
    }
  }

  const handleRetry = () => {
    dispatch(fetchUsers())
  }

  // «Подробнее» открывает страницу навыка выбранного пользователя (LOGIC-34).
  const handleDetailsClick = (userId: string) => {
    navigate(ROUTES.SKILL.replace(':userId', userId))
  }

  return (
    <CatalogPage
      users={users}
      categories={categories}
      cities={cities}
      usersStatus={usersStatus}
      usersError={usersError}
      hasMockUsers={mockUsers.length > 0}
      isFavoriteDisabled={!authSession}
      onRetry={handleRetry}
      onFavoriteClick={handleFavoriteClick}
      onDetailsClick={handleDetailsClick}
    />
  )
}
