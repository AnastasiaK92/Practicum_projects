import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { AvatarUpload } from '@/entities/user/ui/AvatarUpload'
import UserInfoIllustration from '@/shared/assets/illustrations/illustration-user-info.svg'
import { categories, cities } from '@/shared/config/referenceData'
import { ROUTES } from '@/shared/lib/constants'
import { validateBirthDate, validateName } from '@/shared/lib/validators'
import type { Gender } from '@/shared/types'
import { Button } from '@/shared/ui/Button'
import { CityAutocomplete } from '@/shared/ui/CityAutocomplete'
import { DatePicker } from '@/shared/ui/DatePicker'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import {
  SelectMultiCheckbox,
  type SelectMultiCheckboxOption,
} from '@/shared/ui/SelectMultiCheckbox'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateStep2Draft } from '@/store/slices/registrationSlice'
import { AuthLayout } from '@/widgets/AuthLayout'
import { RegistrationProgress } from '@/widgets/RegistrationProgress'

import styles from './RegistrationStep2.module.css'

const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  {
    value: 'preferNotToSay',
    label: 'Не указан',
  },
  {
    value: 'male',
    label: 'Мужской',
  },
  {
    value: 'female',
    label: 'Женский',
  },
]

const CATEGORY_OPTIONS: SelectMultiCheckboxOption[] = categories.map(({ id, name }) => ({
  value: id,
  label: name,
}))

const getCategoryId = (subcategoryId: string) =>
  categories.find(({ subcategories }) => subcategories.some(({ id }) => id === subcategoryId))?.id

const getSubcategoryOptions = (categoryId: string): SelectMultiCheckboxOption[] =>
  categories
    .find(({ id }) => id === categoryId)
    ?.subcategories.map(({ id, name }) => ({
      value: id,
      label: name,
    })) ?? []

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const parseDate = (value?: string) => {
  if (!value) {
    return null
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  const isInvalidDate =
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day

  return isInvalidDate ? null : date
}

const isDataUrl = (value: string) => value.startsWith('data:image/')

export const RegistrationStep2 = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const draft = useAppSelector((state) => state.registration.draft)

  const savedCity = cities.find(({ id }) => id === draft.cityId)?.name ?? ''
  const savedLearningSubcategoryId =
    draft.learningSubcategoryIds?.find((subcategoryId) => getCategoryId(subcategoryId)) ?? ''
  const savedCategoryId = savedLearningSubcategoryId
    ? (getCategoryId(savedLearningSubcategoryId) ?? '')
    : ''

  const [name, setName] = useState(draft.name ?? '')
  const [birthDate, setBirthDate] = useState<Date | null>(parseDate(draft.birthDate))
  const [gender, setGender] = useState<Gender | null>(
    GENDER_OPTIONS.find(({ value }) => value === draft.gender)?.value ?? null,
  )
  const [city, setCity] = useState(savedCity)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    savedCategoryId ? [savedCategoryId] : [],
  )
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<string[]>(
    savedLearningSubcategoryId ? [savedLearningSubcategoryId] : [],
  )
  const [avatar, setAvatar] = useState<string | undefined>(draft.avatarUrl ?? undefined)

  const [nameError, setNameError] = useState<string>()
  const [birthDateError, setBirthDateError] = useState<string>()
  const [genderError, setGenderError] = useState<string>()
  const [cityError, setCityError] = useState<string>()
  const [subcategoryError, setSubcategoryError] = useState<string>()
  const [avatarError, setAvatarError] = useState<string>()

  const selectedCategoryId = selectedCategoryIds[0] ?? ''
  const subcategoryOptions = getSubcategoryOptions(selectedCategoryId)

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    setNameError(undefined)
  }

  const handleCategoryChange = (values: string[]) => {
    const nextCategoryId = values[values.length - 1] ?? ''

    setSelectedCategoryIds(nextCategoryId ? [nextCategoryId] : [])

    if (nextCategoryId !== selectedCategoryId) {
      setSelectedSubcategoryIds([])
    }

    setSubcategoryError(undefined)
  }

  const handleSubcategoryChange = (values: string[]) => {
    const nextSubcategoryId = values[values.length - 1] ?? ''
    const belongsToSelectedCategory = subcategoryOptions.some(
      ({ value }) => value === nextSubcategoryId,
    )

    setSelectedSubcategoryIds(
      nextSubcategoryId && belongsToSelectedCategory ? [nextSubcategoryId] : [],
    )
    setSubcategoryError(undefined)
  }

  const handleAvatarChange = (value?: string) => {
    setAvatar(value)
    setAvatarError(undefined)
  }

  const getStep2Draft = () => {
    const cityId = cities.find(({ name }) => name === city)?.id ?? ''
    const learningSubcategoryId = selectedSubcategoryIds[0]
    const hasValidSubcategory = subcategoryOptions.some(
      ({ value }) => value === learningSubcategoryId,
    )

    return {
      name: name.trim(),
      birthDate: birthDate ? formatDate(birthDate) : '',
      gender,
      cityId,
      avatarUrl: avatar && isDataUrl(avatar) ? avatar : null,
      learningSubcategoryIds:
        learningSubcategoryId && hasValidSubcategory ? [learningSubcategoryId] : [],
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const step2Draft = getStep2Draft()
    const nextNameError = validateName(step2Draft.name)
    const nextBirthDateError = validateBirthDate(step2Draft.birthDate)
    const hasValidGender =
      step2Draft.gender !== null && GENDER_OPTIONS.some(({ value }) => value === step2Draft.gender)
    const hasValidCity = cities.some(({ id }) => id === step2Draft.cityId)
    const hasOneSubcategory = step2Draft.learningSubcategoryIds.length === 1

    const nextGenderError = hasValidGender ? undefined : 'Пол: выберите значение из списка'
    const nextCityError = hasValidCity ? undefined : 'Город: выберите значение из списка'
    const nextSubcategoryError = hasOneSubcategory ? undefined : 'Выберите одну подкатегорию'
    const nextAvatarError =
      avatar && !isDataUrl(avatar) ? 'Аватар должен быть в формате Data URL' : undefined

    setNameError(nextNameError?.message)
    setBirthDateError(nextBirthDateError?.message)
    setGenderError(nextGenderError)
    setCityError(nextCityError)
    setSubcategoryError(nextSubcategoryError)
    setAvatarError(nextAvatarError)

    if (
      nextNameError ||
      nextBirthDateError ||
      nextGenderError ||
      nextCityError ||
      nextSubcategoryError ||
      nextAvatarError
    ) {
      return
    }

    dispatch(updateStep2Draft(step2Draft))
    navigate(ROUTES.REGISTER_STEP_3)
  }

  const handleBack = () => {
    dispatch(updateStep2Draft(getStep2Draft()))
    navigate(ROUTES.REGISTER)
  }

  return (
    <AuthLayout
      topContent={<RegistrationProgress currentStep={2} />}
      infoBlockProps={{
        illustration: <img className={styles.illustration} src={UserInfoIllustration} alt="" />,
        title: 'Расскажите немного о себе',
        description: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
      }}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fields}>
          <AvatarUpload
            image={avatar}
            error={avatarError}
            onImageChange={handleAvatarChange}
            onError={setAvatarError}
          />

          <Input
            label="Имя"
            placeholder="Введите ваше имя"
            value={name}
            onChange={handleNameChange}
            error={nameError}
          />

          <div className={styles.row}>
            <DatePicker
              label="Дата рождения"
              selected={birthDate}
              onChange={(value) => {
                setBirthDate(value)
                setBirthDateError(undefined)
              }}
              error={birthDateError}
            />

            <div className={styles.field}>
              <span className={styles.label}>Пол</span>
              <Select
                className={styles.genderSelect}
                options={GENDER_OPTIONS}
                value={gender ?? ''}
                onChange={(value) => {
                  const selectedGender = GENDER_OPTIONS.find(
                    (option) => option.value === value,
                  )?.value

                  if (selectedGender) {
                    setGender(selectedGender)
                    setGenderError(undefined)
                  }
                }}
                placeholder="Выберите пол"
                error={genderError}
              />
            </div>
          </div>

          <div className={styles.cityField}>
            <span className={styles.label}>Город</span>
            <CityAutocomplete
              className={styles.cityAutocomplete}
              value={city}
              onChange={(value) => {
                setCity(value)
                setCityError(undefined)
              }}
              placeholder="Выберите город"
            />
            {cityError && <span className={styles.error}>{cityError}</span>}
          </div>

          <SelectMultiCheckbox
            className={styles.multiSelect}
            label="Категория навыка, которому хотите научиться"
            options={CATEGORY_OPTIONS}
            value={selectedCategoryIds}
            onChange={handleCategoryChange}
            placeholder="Выберите категорию"
          />

          <SelectMultiCheckbox
            className={styles.multiSelect}
            label="Подкатегория навыка, которому хотите научиться"
            options={subcategoryOptions}
            value={selectedSubcategoryIds}
            onChange={handleSubcategoryChange}
            placeholder="Выберите подкатегорию"
            disabled={!selectedCategoryId}
          />

          {subcategoryError && <span className={styles.error}>{subcategoryError}</span>}
        </div>

        <div className={styles.buttons}>
          <Button className={styles.button} type="button" variant="secondary" onClick={handleBack}>
            Назад
          </Button>
          <Button className={styles.button} type="submit">
            Продолжить
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
