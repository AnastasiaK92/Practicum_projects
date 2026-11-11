import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount, AuthSession, Gender, RegistrationDraft, User } from '@/shared/types'
import type { AppDispatch, RootState } from '@/store'
import {
  setAuthAccount,
  setAuthError,
  setAuthSession,
  setAuthStatus,
} from '@/store/slices/authSlice'
import { clearFavorites } from '@/store/slices/favoritesSlice'
import { clearNotifications } from '@/store/slices/notificationsSlice'
import { resetRegistrationDraft } from '@/store/slices/registrationSlice'
import { clearRequests } from '@/store/slices/requestsSlice'
import { setLocalUser } from '@/store/slices/usersSlice'

// Проверяет, что черновик содержит данные всех трёх шагов.
type CompleteRegistrationDraft = Omit<RegistrationDraft, 'gender'> & {
  gender: Gender
}

// Проверяет наличие данных всех трёх шагов.
// avatarUrl может быть null, но само поле должно существовать.
const isCompleteRegistrationDraft = (
  draft: Partial<RegistrationDraft>,
): draft is CompleteRegistrationDraft =>
  Boolean(
    draft.email &&
    draft.password &&
    draft.name &&
    draft.birthDate &&
    draft.gender !== null &&
    draft.gender !== undefined &&
    draft.cityId &&
    draft.avatarUrl !== undefined &&
    draft.learningSubcategoryIds?.length &&
    draft.offeredSkill,
  )

// Создаёт локального пользователя и завершает регистрацию.
export const finalizeRegistration =
  () =>
  (dispatch: AppDispatch, getState: () => RootState): User | null => {
    const draft = getState().registration.draft

    if (!isCompleteRegistrationDraft(draft)) {
      return null
    }

    const userId = crypto.randomUUID()

    const localUser: User = {
      id: userId,
      name: draft.name,
      birthDate: draft.birthDate,
      gender: draft.gender,
      cityId: draft.cityId,
      avatarUrl: draft.avatarUrl,
      description: '',
      offeredSkill: draft.offeredSkill,
      learningSubcategoryIds: draft.learningSubcategoryIds,
      likesCount: 0,
      createdAt: new Date().toISOString(),
    }

    const account: AuthAccount = {
      userId,
      email: draft.email,
      password: draft.password,
    }

    const session: AuthSession = {
      userId,
    }

    const isUserSaved = storageService.set(STORAGE_KEYS.LOCAL_USER, localUser)
    const isAccountSaved = storageService.set(STORAGE_KEYS.AUTH_ACCOUNT, account)
    const isSessionSaved = storageService.set(STORAGE_KEYS.AUTH_SESSION, session)

    if (!isUserSaved || !isAccountSaved || !isSessionSaved) {
      return null
    }

    // Данные прежнего локального пользователя не должны
    // переходить к новой учётной записи.
    storageService.remove(STORAGE_KEYS.FAVORITES)
    storageService.remove(STORAGE_KEYS.REQUESTS)
    storageService.remove(STORAGE_KEYS.NOTIFICATIONS)

    dispatch(clearFavorites())
    dispatch(clearRequests())
    dispatch(clearNotifications())

    // setLocalUser достаточно для появления пользователя
    // в selectAllUsers. addUser здесь создал бы дубль.
    dispatch(setLocalUser(localUser))
    dispatch(setAuthAccount(account))
    dispatch(setAuthSession(session))
    dispatch(setAuthStatus('succeeded'))
    dispatch(setAuthError(null))
    dispatch(resetRegistrationDraft())

    return localUser
  }
