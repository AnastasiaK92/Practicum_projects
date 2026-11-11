import { beforeEach, describe, expect, it } from 'vitest'

import { STORAGE_KEYS } from '@/shared/lib/constants'
import { storageService } from '@/shared/lib/storageService'

describe('authSlice', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('восстанавливает AuthSession из localStorage при инициализации', async () => {
    const session = {
      userId: 'user-001',
    }

    storageService.set(STORAGE_KEYS.AUTH_SESSION, session)

    // Важно: импортируем slice после записи в storage,
    // чтобы initialState прочитал сохранённую сессию.
    const { default: authReducer } = await import('./authSlice')

    const state = authReducer(undefined, {
      type: 'unknown',
    })

    expect(state.session).toEqual(session)
  })
})
