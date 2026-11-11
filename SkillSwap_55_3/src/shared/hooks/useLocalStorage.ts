import { useEffect, useState } from 'react'

import { storageService } from '@/shared/lib/storageService'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = storageService.get<T>(key)

    return storedValue ?? initialValue
  })

  useEffect(() => {
    const isSaved = storageService.set(key, value)

    if (!isSaved) {
      console.error(`Failed to save to localStorage: ${key}`)
    }
  }, [key, value])

  return [value, setValue] as const
}
