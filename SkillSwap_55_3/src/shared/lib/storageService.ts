export type StorageType = 'local' | 'session'

// Возвращает выбранное браузерное хранилище.
function getBrowserStorage(storageType: StorageType): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  return storageType === 'session' ? window.sessionStorage : window.localStorage
}

export const storageService = {
  // Получает и преобразует сохранённое значение.
  get<T>(key: string, storageType: StorageType = 'local'): T | null {
    try {
      const storage = getBrowserStorage(storageType)
      const storedValue = storage?.getItem(key)

      if (storedValue == null) {
        return null
      }

      return JSON.parse(storedValue) as T
    } catch {
      return null
    }
  },

  // Преобразует и сохраняет значение, возвращая результат операции.
  set<T>(key: string, value: T, storageType: StorageType = 'local'): boolean {
    try {
      const storage = getBrowserStorage(storageType)

      if (!storage) {
        return false
      }

      const serializedValue = JSON.stringify(value)

      if (serializedValue === undefined) {
        return false
      }

      storage.setItem(key, serializedValue)

      return true
    } catch {
      return false
    }
  },

  // Удаляет значение и возвращает результат операции.
  remove(key: string, storageType: StorageType = 'local'): boolean {
    try {
      const storage = getBrowserStorage(storageType)

      if (!storage) {
        return false
      }

      storage.removeItem(key)

      return true
    } catch {
      return false
    }
  },
}
