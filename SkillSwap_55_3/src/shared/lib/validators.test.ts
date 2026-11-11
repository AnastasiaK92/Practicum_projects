import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  validateBirthDate,
  validateEmail,
  validateName,
  validateOfferedSkillDescription,
  validateOfferedSkillTitle,
  validatePassword,
  validateUserDescription,
} from './validators'

describe('validateEmail', () => {
  it('возвращает ошибку для пустой строки', () => {
    expect(validateEmail('')).toEqual({ field: 'email', message: 'Email обязателен для заполнения' })
  })

  it('возвращает ошибку для некорректного формата', () => {
    expect(validateEmail('not-an-email')).toEqual({
      field: 'email',
      message: 'Некорректный формат email',
    })
    expect(validateEmail('a@b')).not.toBeNull()
    expect(validateEmail('a@b.')).not.toBeNull()
  })

  it('возвращает null для корректного email', () => {
    expect(validateEmail('user@example.com')).toBeNull()
  })
})

describe('validatePassword', () => {
  it('возвращает ошибку, если короче 8 символов', () => {
    expect(validatePassword('Ab1!xyz')).toEqual({
      field: 'password',
      message: 'Пароль должен содержать от 8 до 64 символов',
    })
  })

  it('возвращает ошибку, если длиннее 64 символов', () => {
    const tooLong = `Ab1!${'x'.repeat(61)}`
    expect(tooLong.length).toBe(65)
    expect(validatePassword(tooLong)).toEqual({
      field: 'password',
      message: 'Пароль должен содержать от 8 до 64 символов',
    })
  })

  it('принимает пароль ровно на границах длины (8 и 64 символа)', () => {
    expect(validatePassword('Ab1!xyzw')).toBeNull()
    const exact64 = `Ab1!${'x'.repeat(60)}`
    expect(exact64.length).toBe(64)
    expect(validatePassword(exact64)).toBeNull()
  })

  it('требует строчную букву', () => {
    expect(validatePassword('AB1!AB1!')).toEqual({
      field: 'password',
      message: 'Пароль должен содержать строчную букву',
    })
  })

  it('требует заглавную букву', () => {
    expect(validatePassword('ab1!ab1!')).toEqual({
      field: 'password',
      message: 'Пароль должен содержать заглавную букву',
    })
  })

  it('требует цифру', () => {
    expect(validatePassword('Abcd!Abc')).toEqual({
      field: 'password',
      message: 'Пароль должен содержать цифру',
    })
  })

  it('требует спецсимвол', () => {
    expect(validatePassword('Abcd1234')).toEqual({
      field: 'password',
      message: 'Пароль должен содержать специальный символ',
    })
  })

  it('возвращает null для валидного пароля', () => {
    expect(validatePassword('Str0ng!Pass')).toBeNull()
  })

  it('не считает пробел специальным символом', () => {
    expect(validatePassword('Abcdef1 ')).toEqual({
      field: 'password',
      message: 'Пароль должен содержать специальный символ',
    })
  })

  it('не считает кириллическую букву специальным символом', () => {
    expect(validatePassword('Abcdef1я')).toEqual({
      field: 'password',
      message: 'Пароль должен содержать специальный символ',
    })
  })

  it('поддерживает строчные и заглавные буквы кириллицы', () => {
    expect(validatePassword('Пароль1!')).toBeNull()
  })
})

describe('validateName', () => {
  it('возвращает ошибку для пустой строки после trim', () => {
    expect(validateName('   ')).toEqual({ field: 'name', message: 'Имя: обязательное поле' })
  })

  it('не учитывает пробелы по краям при проверке длины', () => {
    expect(validateName('  Иван  ')).toBeNull()
  })

  it('не нормализует внутренние пробелы', () => {
    expect(validateName('Иван  Петров')).toBeNull()
  })

  it('принимает имя ровно из 30 символов', () => {
    expect(validateName('a'.repeat(30))).toBeNull()
  })

  it('отклоняет имя длиннее 30 символов', () => {
    expect(validateName('a'.repeat(31))).toEqual({
      field: 'name',
      message: 'Имя: максимальная длина 30 символов',
    })
  })
})

describe('validateOfferedSkillTitle', () => {
  it('возвращает ошибку для пустой строки', () => {
    expect(validateOfferedSkillTitle('')).toEqual({
      field: 'offeredSkill.title',
      message: 'Название навыка: обязательное поле',
    })
  })

  it('принимает строку ровно из 30 символов', () => {
    expect(validateOfferedSkillTitle('a'.repeat(30))).toBeNull()
  })

  it('отклоняет строку длиннее 30 символов', () => {
    expect(validateOfferedSkillTitle('a'.repeat(31))).not.toBeNull()
  })
})

describe('validateOfferedSkillDescription', () => {
  it('отклоняет описание короче 20 символов', () => {
    expect(validateOfferedSkillDescription('a'.repeat(19))).toEqual({
      field: 'offeredSkill.description',
      message: 'Описание навыка: минимальная длина 20 символов',
    })
  })

  it('принимает описание ровно из 20 символов', () => {
    expect(validateOfferedSkillDescription('a'.repeat(20))).toBeNull()
  })

  it('принимает описание ровно из 500 символов', () => {
    expect(validateOfferedSkillDescription('a'.repeat(500))).toBeNull()
  })

  it('отклоняет описание длиннее 500 символов', () => {
    expect(validateOfferedSkillDescription('a'.repeat(501))).toEqual({
      field: 'offeredSkill.description',
      message: 'Описание навыка: максимальная длина 500 символов',
    })
  })
})

describe('validateUserDescription', () => {
  it('допускает пустую строку (минимум 0)', () => {
    expect(validateUserDescription('')).toBeNull()
    expect(validateUserDescription('   ')).toBeNull()
  })

  it('принимает описание ровно из 160 символов', () => {
    expect(validateUserDescription('a'.repeat(160))).toBeNull()
  })

  it('отклоняет описание длиннее 160 символов', () => {
    expect(validateUserDescription('a'.repeat(161))).toEqual({
      field: 'description',
      message: 'Описание профиля: максимальная длина 160 символов',
    })
  })
})

describe('validateBirthDate', () => {
  // Дату теста фиксируем через vi.setSystemTime(), чтобы результат не зависел
  // от дня и времени фактического запуска тестов.
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-06T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('возвращает ошибку для пустой строки', () => {
    expect(validateBirthDate('')).toEqual({
      field: 'birthDate',
      message: 'Дата рождения обязательна для заполнения',
    })
  })

  it('возвращает ошибку для некорректного формата', () => {
    expect(validateBirthDate('not-a-date')).toEqual({
      field: 'birthDate',
      message: 'Некорректная дата рождения',
    })
  })

  it('отклоняет несуществующую календарную дату', () => {
    expect(validateBirthDate('2026-02-31')).toEqual({
      field: 'birthDate',
      message: 'Некорректная дата рождения',
    })
  })

  it('принимает сегодняшнюю дату', () => {
    expect(validateBirthDate('2026-09-06')).toBeNull()
  })

  it('отклоняет дату в будущем', () => {
    expect(validateBirthDate('2026-09-07')).toEqual({
      field: 'birthDate',
      message: 'Дата рождения не может быть в будущем',
    })
  })

  it('принимает дату ровно 120 лет назад', () => {
    expect(validateBirthDate('1906-09-06')).toBeNull()
  })

  it('отклоняет дату старше 120 лет на один день', () => {
    expect(validateBirthDate('1906-09-05')).toEqual({
      field: 'birthDate',
      message: 'Возраст не может превышать 120 лет',
    })
  })

  it('не ограничивает минимальный возраст', () => {
    expect(validateBirthDate('2026-09-06')).toBeNull()
  })
})
