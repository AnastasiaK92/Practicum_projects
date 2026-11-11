import { describe, expect, it } from 'vitest'

import { validateAndConvertFiles } from './fileValidation'

const createFile = (name: string, type: string, size = 100, content = 'test content') => {
  const file = new File([content], name, { type })

  // Позволяет задавать размер файла для проверки лимита 1 МБ.
  if (size !== file.size) {
    Object.defineProperty(file, 'size', {
      value: size,
      configurable: true,
    })
  }

  return file
}

describe('validateAndConvertFiles', () => {
  describe('avatar', () => {
    it('принимает один JPG-файл', async () => {
      const file = createFile('avatar.jpg', 'image/jpeg')

      const result = await validateAndConvertFiles([file], 'avatar')

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.files).toHaveLength(1)
        expect(result.files[0]).toBe('data:image/jpeg;base64,dGVzdCBjb250ZW50')
      }
    })

    it('принимает PNG-файл', async () => {
      const file = createFile('avatar.png', 'image/png')

      const result = await validateAndConvertFiles([file], 'avatar')

      expect(result.success).toBe(true)
    })

    it('принимает WebP-файл', async () => {
      const file = createFile('avatar.webp', 'image/webp')

      const result = await validateAndConvertFiles([file], 'avatar')

      expect(result.success).toBe(true)
    })

    it('отклоняет два файла для аватара', async () => {
      const files = [
        createFile('avatar-1.jpg', 'image/jpeg'),
        createFile('avatar-2.jpg', 'image/jpeg'),
      ]

      const result = await validateAndConvertFiles(files, 'avatar')

      expect(result).toEqual({
        success: false,
        error: 'Можно загрузить только один аватар',
      })
    })
  })

  describe('skillImages', () => {
    it('принимает отсутствие изображений', async () => {
      const result = await validateAndConvertFiles([], 'skillImages')

      expect(result).toEqual({
        success: true,
        files: [],
      })
    })

    it('принимает отсутствие аватара', async () => {
      const result = await validateAndConvertFiles([], 'avatar')

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.files).toHaveLength(0)
      }
    })

    it('принимает одно изображение', async () => {
      const file = createFile('skill.jpg', 'image/jpeg')

      const result = await validateAndConvertFiles([file], 'skillImages')

      expect(result.success).toBe(true)
    })

    it('принимает ровно 5 изображений', async () => {
      const files = Array.from({ length: 5 }, (_, index) =>
        createFile(`skill-${index + 1}.jpg`, 'image/jpeg'),
      )

      const result = await validateAndConvertFiles(files, 'skillImages')

      expect(result.success).toBe(true)

      if (result.success) {
        expect(result.files).toHaveLength(5)
      }
    })

    it('отклоняет 6 изображений', async () => {
      const files = Array.from({ length: 6 }, (_, index) =>
        createFile(`skill-${index + 1}.jpg`, 'image/jpeg'),
      )

      const result = await validateAndConvertFiles(files, 'skillImages')

      expect(result).toEqual({
        success: false,
        error: 'Можно загрузить не более 5 изображений',
      })
    })
  })

  describe('валидация файла', () => {
    it('отклоняет неподдерживаемый формат', async () => {
      const file = createFile('image.gif', 'image/gif')

      const result = await validateAndConvertFiles([file], 'avatar')

      expect(result).toEqual({
        success: false,
        error: 'Поддерживаются только JPG, JPEG, PNG и WebP',
      })
    })

    it('отклоняет файл размером больше 1 МБ', async () => {
      const file = createFile('large.jpg', 'image/jpeg', 1024 * 1024 + 1)

      const result = await validateAndConvertFiles([file], 'avatar')

      expect(result).toEqual({
        success: false,
        error: 'Размер изображения не должен превышать 1 МБ',
      })
    })

    it('принимает файл размером ровно 1 МБ', async () => {
      const file = createFile('max-size.jpg', 'image/jpeg', 1024 * 1024)

      const result = await validateAndConvertFiles([file], 'avatar')

      expect(result.success).toBe(true)
    })
  })
})
