

/** Форматирует дату в читаемый вид */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

/** Обрезает строку до maxLength символов */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/** Генерирует уникальный id */
export function generateId(): string {
  return crypto.randomUUID()
}

/** Вычисляет полный возраст по дате рождения. */
export function calculateAge(birthDate: string): number {
  const today = new Date()
  const dateOfBirth = new Date(`${birthDate}T00:00:00`)

  let age = today.getFullYear() - dateOfBirth.getFullYear()

  const hasBirthdayPassed =
    today.getMonth() > dateOfBirth.getMonth() ||
    (today.getMonth() === dateOfBirth.getMonth() &&
      today.getDate() >= dateOfBirth.getDate())

  if (!hasBirthdayPassed) {
    age -= 1
  }

  return age
}
