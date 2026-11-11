export type FileUploadType = 'avatar' | 'skillImages'

export type FileValidationResult =
  | {
      success: true
      files: string[]
    }
  | {
      success: false
      error: string
    }

const MAX_FILE_SIZE = 1024 * 1024 // 1 МБ

const ALLOWED_FILE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

const FILE_LIMITS = {
  avatar: {
    min: 0,
    max: 1,
  },
  skillImages: {
    min: 1,
    max: 5,
  },
} as const

/**
 * Преобразует File в Data URL.
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Не удалось прочитать файл'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Проверяет выбранные изображения и преобразует их в Data URL.
 */
export async function validateAndConvertFiles(
  files: File[],
  type: FileUploadType,
): Promise<FileValidationResult> {
  const limits = FILE_LIMITS[type]


  if (files.length > limits.max) {
    return {
      success: false,
      error:
        type === 'avatar'
          ? 'Можно загрузить только один аватар'
          : 'Можно загрузить не более 5 изображений',
    }
  }

  for (const file of files) {
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return {
        success: false,
        error: 'Поддерживаются только JPG, JPEG, PNG и WebP',
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'Размер изображения не должен превышать 1 МБ',
      }
    }
  }

  try {
    const dataUrls = await Promise.all(files.map(fileToDataUrl))

    return {
      success: true,
      files: dataUrls,
    }
  } catch {
    return {
      success: false,
      error: 'Не удалось обработать изображение',
    }
  }
}
