/** Результат проверки одного поля: ключ поля и текст ошибки, либо null, если поле валидно. */
export interface FieldError {
  field: string
  message: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 64
const MAX_AGE = 120
const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/

const LOWERCASE_REGEX = /\p{Ll}/u
const UPPERCASE_REGEX = /\p{Lu}/u
const DIGIT_REGEX = /\p{Nd}/u
const SPECIAL_CHARACTER_REGEX = /[\p{P}\p{S}]/u

/** Проверяет email: обязателен, базовый формат по regex. */
export function validateEmail(value: string): FieldError | null {
  if (value.length === 0) {
    return { field: 'email', message: 'Email обязателен для заполнения' }
  }
  if (!EMAIL_REGEX.test(value)) {
    return { field: 'email', message: 'Некорректный формат email' }
  }
  return null
}

/** Проверяет пароль: 8-64 символа, строчная и заглавная буква, цифра, спецсимвол. */
export function validatePassword(value: string): FieldError | null {
  if (value.length < MIN_PASSWORD_LENGTH || value.length > MAX_PASSWORD_LENGTH) {
    return {
      field: 'password',
      message: `Пароль должен содержать от ${MIN_PASSWORD_LENGTH} до ${MAX_PASSWORD_LENGTH} символов`,
    }
  }
  if (!LOWERCASE_REGEX.test(value)) {
    return { field: 'password', message: 'Пароль должен содержать строчную букву' }
  }
  if (!UPPERCASE_REGEX.test(value)) {
    return { field: 'password', message: 'Пароль должен содержать заглавную букву' }
  }
  if (!DIGIT_REGEX.test(value)) {
    return { field: 'password', message: 'Пароль должен содержать цифру' }
  }
  if (!SPECIAL_CHARACTER_REGEX.test(value)) {
    return { field: 'password', message: 'Пароль должен содержать специальный символ' }
  }
  return null
}

/**
 * Базовая проверка текстового поля с обрезкой пробелов по краям (trim) и
 * ограничением длины. Внутренние пробелы не нормализуются. Общая логика для
 * name, offeredSkill.title, offeredSkill.description и User.description —
 * переиспользуется страницами регистрации и профиля, чтобы правила не
 * дублировались.
 */
function validateTrimmedLength(
  value: string,
  field: string,
  min: number,
  max: number,
  label: string,
): FieldError | null {
  const trimmed = value.trim()
  if (trimmed.length === 0 && min > 0) {
    return { field, message: `${label}: обязательное поле` }
  }
  if (trimmed.length < min) {
    return { field, message: `${label}: минимальная длина ${min} символов` }
  }
  if (trimmed.length > max) {
    return { field, message: `${label}: максимальная длина ${max} символов` }
  }
  return null
}

/** Проверяет имя пользователя (1-30 символов после trim). */
export function validateName(value: string): FieldError | null {
  return validateTrimmedLength(value, 'name', 1, 30, 'Имя')
}

/** Проверяет название навыка offeredSkill.title (1-30 символов после trim). */
export function validateOfferedSkillTitle(value: string): FieldError | null {
  return validateTrimmedLength(value, 'offeredSkill.title', 1, 30, 'Название навыка')
}

/** Проверяет описание навыка offeredSkill.description (20-500 символов после trim). */
export function validateOfferedSkillDescription(value: string): FieldError | null {
  return validateTrimmedLength(value, 'offeredSkill.description', 20, 500, 'Описание навыка')
}

/** Проверяет описание пользователя User.description (0-160 символов после trim). */
export function validateUserDescription(value: string): FieldError | null {
  return validateTrimmedLength(value, 'description', 0, 160, 'Описание профиля')
}

/**
 * Проверяет дату рождения: строгий формат YYYY-MM-DD (без автокоррекции
 * несуществующих календарных дат вроде 31 февраля), не в будущем, не старше
 * 120 лет (сравнение по точной дате, а не только по количеству полных лет).
 * Минимальный возраст не ограничен.
 */
export function validateBirthDate(value: string): FieldError | null {
  if (value.length === 0) {
    return { field: 'birthDate', message: 'Дата рождения обязательна для заполнения' }
  }

  const match = DATE_REGEX.exec(value)
  if (!match) {
    return { field: 'birthDate', message: 'Некорректная дата рождения' }
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const birthDate = new Date(`${value}T00:00:00`)

  const isInvalidDate =
    Number.isNaN(birthDate.getTime()) ||
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day

  if (isInvalidDate) {
    return { field: 'birthDate', message: 'Некорректная дата рождения' }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (birthDate > today) {
    return { field: 'birthDate', message: 'Дата рождения не может быть в будущем' }
  }

  const oldestAllowedDate = new Date(today)
  oldestAllowedDate.setFullYear(today.getFullYear() - MAX_AGE)

  if (birthDate < oldestAllowedDate) {
    return { field: 'birthDate', message: `Возраст не может превышать ${MAX_AGE} лет` }
  }

  return null
}
