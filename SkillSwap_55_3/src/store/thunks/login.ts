import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'
import type { AuthAccount, AuthSession } from '@/shared/types'
import type { AppDispatch } from '@/store'
import {
  setAuthAccount,
  setAuthError,
  setAuthSession,
  setAuthStatus,
} from '@/store/slices/authSlice'
import { restoreFavorites } from '../slices/favoritesSlice'

export interface LoginCredentials {
  email: string
  password: string
}

export const login =
  ({ email, password }: LoginCredentials) =>
  (dispatch: AppDispatch): boolean => {
    const account = storageService.get<AuthAccount>(STORAGE_KEYS.AUTH_ACCOUNT)
    const isCredentialsValid = account?.email === email.trim() && account.password === password

    if (!isCredentialsValid || !account) {
      dispatch(setAuthStatus('failed'))
      dispatch(setAuthError('Email или пароль введен неверно.'))
      return false
    }

    const session: AuthSession = { userId: account.userId }

    if (!storageService.set(STORAGE_KEYS.AUTH_SESSION, session)) {
      dispatch(setAuthStatus('failed'))
      dispatch(setAuthError('Email или пароль введен неверно.'))
      return false
    }

    dispatch(setAuthAccount(account))
    dispatch(setAuthSession(session))
    dispatch(restoreFavorites())
    dispatch(setAuthStatus('succeeded'))
    dispatch(setAuthError(null))

    return true
  }
