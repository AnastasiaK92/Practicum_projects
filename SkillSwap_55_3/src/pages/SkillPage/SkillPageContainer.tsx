import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { NotFoundPage } from '@/pages/NotFoundPage'
import { mapUserToCatalogCard } from '@/pages/CatalogPage/CatalogPage.utils'
import DoneIcon from '@/shared/assets/icons/icon-done.svg?react'
import { categories, cities } from '@/shared/config'
import { ROUTES } from '@/shared/lib/constants'
import { Modal } from '@/shared/ui/Modal'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addFavorite, removeFavorite, selectFavoriteUserIds } from '@/store/slices/favoritesSlice'
import {
  fetchUsers,
  selectEffectiveLearningSubcategoryIds,
  selectEffectiveLikesCount,
  selectSimilarUsers,
  selectUserById,
  selectUsersStatus,
} from '@/store/slices/usersSlice'
import { StatusModalContent } from '@/widgets/StatusModalContent'

import { SkillPage } from './SkillPage'
import { mapUserToSkillPageProps } from './SkillPage.utils'

interface SkillPageLocationState {
  registrationCompleted?: boolean
}

export const SkillPageContainer = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { userId } = useParams<{ userId: string }>()

  const [isRegistrationSuccessOpen, setIsRegistrationSuccessOpen] = useState(() =>
    Boolean((location.state as SkillPageLocationState | null)?.registrationCompleted),
  )

  const usersStatus = useAppSelector(selectUsersStatus)
  const user = useAppSelector((state) => (userId ? selectUserById(state, userId) : null))
  const similarUsers = useAppSelector((state) => (userId ? selectSimilarUsers(state, userId) : []))
  const favoriteUserIds = useAppSelector(selectFavoriteUserIds)

  const effectiveLikesCountByUserId = useAppSelector((state) =>
    Object.fromEntries(
      similarUsers.map((similarUser) => [
        similarUser.id,
        selectEffectiveLikesCount(state, similarUser.id),
      ]),
    ),
  )

  const effectiveLearningSubcategoryIdsByUserId = useAppSelector((state) =>
    Object.fromEntries(
      similarUsers.map((similarUser) => [
        similarUser.id,
        selectEffectiveLearningSubcategoryIds(state, similarUser.id),
      ]),
    ),
  )

  const authSession = useAppSelector((state) => state.auth.session)
  const authAccount = useAppSelector((state) => state.auth.account)
  const currentUser = useAppSelector((state) =>
    authSession ? selectUserById(state, authSession.userId) : null,
  )

  const isAuthenticated = Boolean(authSession && authAccount)

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [dispatch, usersStatus])

  const handleCloseRegistrationSuccess = () => {
    setIsRegistrationSuccessOpen(false)

    navigate(location.pathname, {
      replace: true,
      state: null,
    })
  }

  const handleFavoriteClick = (similarUserId: string) => {
    if (!isAuthenticated) {
      return
    }

    if (favoriteUserIds.includes(similarUserId)) {
      dispatch(removeFavorite(similarUserId))
    } else {
      dispatch(addFavorite(similarUserId))
    }
  }

  const handleDetailsClick = (similarUserId: string) => {
    navigate(ROUTES.SKILL.replace(':userId', similarUserId))
  }

  if (!userId) {
    return <NotFoundPage />
  }

  if (!user) {
    if (usersStatus === 'idle' || usersStatus === 'loading') {
      return <div>Загрузка...</div>
    }

    return <NotFoundPage />
  }

  const skillPageProps = mapUserToSkillPageProps(user, categories, cities)

  const similarOffers = similarUsers.map((similarUser) => ({
    user: mapUserToCatalogCard(
      similarUser,
      categories,
      cities,
      favoriteUserIds.includes(similarUser.id),
      effectiveLikesCountByUserId[similarUser.id] ?? similarUser.likesCount,
      effectiveLearningSubcategoryIdsByUserId[similarUser.id] ?? similarUser.learningSubcategoryIds,
    ),
    isFavoriteDisabled: !isAuthenticated,
    onFavoriteClick: () => handleFavoriteClick(similarUser.id),
    onDetailsClick: () => handleDetailsClick(similarUser.id),
  }))

  return (
    <>
      <SkillPage
        {...skillPageProps}
        similarOffers={similarOffers}
        isAuth={isAuthenticated}
        authUser={
          currentUser
            ? {
                userName: currentUser.name,
                avatarSrc: currentUser.avatarUrl ?? '',
              }
            : undefined
        }
      />

      {isRegistrationSuccessOpen && (
        <Modal>
          <StatusModalContent
            icon={<DoneIcon />}
            title="Ваше предложение создано"
            text="Теперь вы можете предложить обмен"
            buttonText="Готово"
            onButtonClick={handleCloseRegistrationSuccess}
          />
        </Modal>
      )}
    </>
  )
}
