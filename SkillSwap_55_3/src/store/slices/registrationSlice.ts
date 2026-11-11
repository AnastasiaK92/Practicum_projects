import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { RegistrationDraft } from '@/shared/types'

type RegistrationStep1Draft = Pick<RegistrationDraft, 'email' | 'password'>

type RegistrationStep2Draft = Pick<
  RegistrationDraft,
  'name' | 'birthDate' | 'gender' | 'cityId' | 'avatarUrl' | 'learningSubcategoryIds'
>

type RegistrationStep3Draft = Pick<RegistrationDraft, 'offeredSkill'>

export interface RegistrationState {
  draft: Partial<RegistrationDraft>
}

// Задаёт пустой черновик регистрации без восстановления из browser storage.
const initialState: RegistrationState = {
  draft: {},
}

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    // Сохраняет данные первого шага, не изменяя остальные части черновика.
    updateStep1Draft(state, action: PayloadAction<RegistrationStep1Draft>) {
      state.draft = {
        ...state.draft,
        ...action.payload,
      }
    },

    // Сохраняет данные второго шага, не изменяя остальные части черновика.
    updateStep2Draft(state, action: PayloadAction<RegistrationStep2Draft>) {
      state.draft = {
        ...state.draft,
        ...action.payload,
      }
    },

    // Сохраняет данные третьего шага, не изменяя остальные части черновика.
    updateStep3Draft(state, action: PayloadAction<RegistrationStep3Draft>) {
      state.draft = {
        ...state.draft,
        ...action.payload,
      }
    },

    // Возвращает черновик регистрации к первоначальному состоянию.
    resetRegistrationDraft() {
      return initialState
    },
  },
})

export const { updateStep1Draft, updateStep2Draft, updateStep3Draft, resetRegistrationDraft } =
  registrationSlice.actions

export default registrationSlice.reducer
