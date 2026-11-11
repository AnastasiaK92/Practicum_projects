import { beforeEach, describe, expect, it, vi } from 'vitest'

import { storageService } from './storageService'

const TEST_KEY = 'test_key'

describe('storageService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('сохраняет и получает данные из localStorage', () => {
    const value = {
      id: 'user-1',
      name: 'Мария',
    }

    const isSaved = storageService.set(TEST_KEY, value)
    const storedValue = storageService.get<typeof value>(TEST_KEY)

    expect(isSaved).toBe(true)
    expect(storedValue).toEqual(value)
  })

  it('возвращает null, если значение отсутствует', () => {
    const storedValue = storageService.get<string>(TEST_KEY)

    expect(storedValue).toBeNull()
  })

  it('возвращает null, если сохранённый JSON повреждён', () => {
    window.localStorage.setItem(TEST_KEY, '{invalid-json')

    const storedValue = storageService.get<string>(TEST_KEY)

    expect(storedValue).toBeNull()
  })

  it('удаляет значение из localStorage', () => {
    storageService.set(TEST_KEY, 'value')

    const isRemoved = storageService.remove(TEST_KEY)

    expect(isRemoved).toBe(true)
    expect(storageService.get<string>(TEST_KEY)).toBeNull()
  })

  it('работает с sessionStorage', () => {
    const isSaved = storageService.set(TEST_KEY, 'session-value', 'session')

    expect(isSaved).toBe(true)
    expect(storageService.get<string>(TEST_KEY, 'session')).toBe('session-value')
    expect(storageService.get<string>(TEST_KEY)).toBeNull()
  })

  it('возвращает false при переполнении хранилища', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage quota exceeded', 'QuotaExceededError')
    })

    const isSaved = storageService.set(TEST_KEY, 'value')

    expect(isSaved).toBe(false)
  })
})
