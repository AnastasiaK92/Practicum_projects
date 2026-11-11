import { describe, expect, it } from 'vitest'

import type { RegistrationDraft } from '@/shared/types'

import registrationReducer, {
  resetRegistrationDraft,
  updateStep1Draft,
  updateStep2Draft,
  updateStep3Draft,
} from './registrationSlice'

const step1Data = {
  email: 'user@example.com',
  password: 'password123',
}

const step2Data = {
  name: 'Алексей',
  birthDate: '1983-01-01',
  gender: 'male' as const,
  cityId: 'saint-petersburg',
  avatarUrl: null,
  learningSubcategoryIds: ['english'],
}

const offeredSkill: RegistrationDraft['offeredSkill'] = {
  title: 'Видеомонтаж',
  categoryId: 'creative',
  subcategoryId: 'video-editing',
  description: 'Научу основам видеомонтажа',
  imageUrls: [],
}

describe('registrationSlice', () => {
  it('создаёт пустой черновик при инициализации', () => {
    const state = registrationReducer(undefined, { type: 'unknown' })

    expect(state.draft).toEqual({})
  })

  it('сохраняет данные первого шага', () => {
    const state = registrationReducer(undefined, updateStep1Draft(step1Data))

    expect(state.draft).toEqual(step1Data)
  })

  it('сохраняет данные второго шага, не затирая первый шаг', () => {
    const stateAfterStep1 = registrationReducer(undefined, updateStep1Draft(step1Data))

    const stateAfterStep2 = registrationReducer(stateAfterStep1, updateStep2Draft(step2Data))

    expect(stateAfterStep2.draft).toEqual({
      ...step1Data,
      ...step2Data,
    })
  })

  it('сохраняет данные третьего шага, не затирая предыдущие шаги', () => {
    const stateAfterStep1 = registrationReducer(undefined, updateStep1Draft(step1Data))
    const stateAfterStep2 = registrationReducer(stateAfterStep1, updateStep2Draft(step2Data))

    const stateAfterStep3 = registrationReducer(stateAfterStep2, updateStep3Draft({ offeredSkill }))

    expect(stateAfterStep3.draft).toEqual({
      ...step1Data,
      ...step2Data,
      offeredSkill,
    })
  })

  it('обновляет данные шага, сохраняя данные остальных шагов', () => {
    const stateWithStep1 = registrationReducer(undefined, updateStep1Draft(step1Data))
    const stateWithTwoSteps = registrationReducer(stateWithStep1, updateStep2Draft(step2Data))

    const updatedState = registrationReducer(
      stateWithTwoSteps,
      updateStep1Draft({
        email: 'updated@example.com',
        password: 'new-password',
      }),
    )

    expect(updatedState.draft).toEqual({
      ...step2Data,
      email: 'updated@example.com',
      password: 'new-password',
    })
  })

  it('сбрасывает черновик к первоначальному состоянию', () => {
    const filledState = registrationReducer(undefined, updateStep1Draft(step1Data))

    const resetState = registrationReducer(filledState, resetRegistrationDraft())

    expect(resetState.draft).toEqual({})
  })

  it('не восстанавливает ранее заполненный черновик при повторной инициализации', () => {
    const filledState = registrationReducer(undefined, updateStep1Draft(step1Data))
    const initializedAgain = registrationReducer(undefined, {
      type: 'unknown',
    })

    expect(filledState.draft).toEqual(step1Data)
    expect(initializedAgain.draft).toEqual({})
  })
})
