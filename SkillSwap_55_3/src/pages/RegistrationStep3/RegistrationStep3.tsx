import { useState, type ChangeEvent, type FormEvent } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'

import SchoolBoardIllustration from '@/shared/assets/illustrations/illustration-school-board.svg'
import { categories } from '@/shared/config/referenceData'
import { ROUTES } from '@/shared/lib/constants'
import { validateOfferedSkillDescription, validateOfferedSkillTitle } from '@/shared/lib/validators'
import { Button } from '@/shared/ui/Button'
import { ImageUpload } from '@/shared/ui/ImageUpload'
import { Input } from '@/shared/ui/Input'
import { Select, type SelectOption } from '@/shared/ui/Select'
import { Textarea } from '@/shared/ui/Textarea'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateStep3Draft } from '@/store/slices/registrationSlice'
import { AuthLayout } from '@/widgets/AuthLayout'
import { RegistrationProgress } from '@/widgets/RegistrationProgress'
import { finalizeRegistration } from '@/store/thunks/finalizeRegistration'
import { SkillConfirmationModal } from '@/widgets/SkillConfirmationModal'

import styles from './RegistrationStep3.module.css'

const CATEGORY_OPTIONS: SelectOption[] = categories.map(({ id, name }) => ({
  value: id,
  label: name,
}))

const getSubcategoryOptions = (categoryId: string): SelectOption[] =>
  categories
    .find(({ id }) => id === categoryId)
    ?.subcategories.map(({ id, name }) => ({
      value: id,
      label: name,
    })) ?? []

export const RegistrationStep3 = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const draft = useAppSelector((state) => state.registration.draft)
  const savedSkill = draft.offeredSkill

  const [title, setTitle] = useState(savedSkill?.title ?? '')
  const [categoryId, setCategoryId] = useState(savedSkill?.categoryId ?? '')
  const [subcategoryId, setSubcategoryId] = useState(savedSkill?.subcategoryId ?? '')
  const [description, setDescription] = useState(savedSkill?.description ?? '')
  const [images, setImages] = useState<string[]>(savedSkill?.imageUrls ?? [])

  const [titleError, setTitleError] = useState<string>()
  const [categoryError, setCategoryError] = useState<string>()
  const [subcategoryError, setSubcategoryError] = useState<string>()
  const [descriptionError, setDescriptionError] = useState<string>()
  const [imageError, setImageError] = useState<string>()

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

  const subcategoryOptions = getSubcategoryOptions(categoryId)

  const confirmationSkill = draft.offeredSkill

  const confirmationCategory = categories.find(({ id }) => id === confirmationSkill?.categoryId)

  const confirmationSubcategory = confirmationCategory?.subcategories.find(
    ({ id }) => id === confirmationSkill?.subcategoryId,
  )

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    setTitleError(undefined)
  }

  const handleCategoryChange = (nextCategoryId: string) => {
    const nextSubcategoryOptions = getSubcategoryOptions(nextCategoryId)
    const subcategoryStillMatches = nextSubcategoryOptions.some(
      ({ value }) => value === subcategoryId,
    )

    setCategoryId(nextCategoryId)
    setCategoryError(undefined)

    if (!subcategoryStillMatches) {
      setSubcategoryId('')
      setSubcategoryError(undefined)
    }
  }

  const handleSubcategoryChange = (nextSubcategoryId: string) => {
    const belongsToCategory = subcategoryOptions.some(({ value }) => value === nextSubcategoryId)

    setSubcategoryId(belongsToCategory ? nextSubcategoryId : '')
    setSubcategoryError(undefined)
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value)
    setDescriptionError(undefined)
  }

  const handleImagesChange = (nextImages: string[]) => {
    setImages(nextImages)
    setImageError(undefined)
  }

  const getStep3Draft = () => ({
    title: title.trim(),
    categoryId,
    subcategoryId,
    description: description.trim(),

    // Порядок сохраняется: imageUrls[0] остаётся главным.
    imageUrls: images,
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const offeredSkill = getStep3Draft()
    const nextTitleError = validateOfferedSkillTitle(offeredSkill.title)
    const nextDescriptionError = validateOfferedSkillDescription(offeredSkill.description)
    const selectedCategory = categories.find(({ id }) => id === offeredSkill.categoryId)
    const hasValidCategory = Boolean(selectedCategory)
    const hasValidSubcategory =
      selectedCategory?.subcategories.some(({ id }) => id === offeredSkill.subcategoryId) ?? false

    const nextCategoryError = hasValidCategory
      ? undefined
      : 'Категория навыка: выберите значение из списка'
    const nextSubcategoryError = hasValidSubcategory
      ? undefined
      : 'Подкатегория навыка: выберите значение из списка'
    const nextImageError =
      offeredSkill.imageUrls.length === 0
        ? 'Необходимо выбрать хотя бы одно изображение'
        : offeredSkill.imageUrls.length > 5
          ? 'Можно загрузить не более 5 изображений'
          : undefined

    setTitleError(nextTitleError?.message)
    setCategoryError(nextCategoryError)
    setSubcategoryError(nextSubcategoryError)
    setDescriptionError(nextDescriptionError?.message)
    setImageError(nextImageError)

    if (
      nextTitleError ||
      nextCategoryError ||
      nextSubcategoryError ||
      nextDescriptionError ||
      nextImageError
    ) {
      return
    }

    dispatch(updateStep3Draft({ offeredSkill }))
    setIsConfirmationOpen(true)
  }

  const handleBack = () => {
    dispatch(
      updateStep3Draft({
        offeredSkill: getStep3Draft(),
      }),
    )
    navigate(ROUTES.REGISTER_STEP_2)
  }

  const handleEdit = () => {
    setIsConfirmationOpen(false)
  }

  const handleDone = () => {
    const localUser = dispatch(finalizeRegistration())

    if (!localUser) {
      return
    }

    navigate(
      generatePath(ROUTES.SKILL, {
        userId: localUser.id,
      }),
      {
        state: {
          registrationCompleted: true,
        },
      },
    )
  }

  return (
    <>
      <AuthLayout
        topContent={<RegistrationProgress currentStep={3} />}
        infoBlockProps={{
          illustration: (
            <img className={styles.illustration} src={SchoolBoardIllustration} alt="" />
          ),
          title: 'Укажите, чем вы готовы поделиться',
          description: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
        }}
      >
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fields}>
            <Input
              label="Название навыка"
              placeholder="Введите название вашего навыка"
              value={title}
              onChange={handleTitleChange}
              error={titleError}
            />

            <Select
              label="Категория навыка"
              placeholder="Выберите категорию навыка"
              options={CATEGORY_OPTIONS}
              value={categoryId}
              onChange={handleCategoryChange}
              error={categoryError}
            />

            <Select
              label="Подкатегория навыка"
              placeholder="Выберите подкатегорию навыка"
              options={subcategoryOptions}
              value={subcategoryId}
              onChange={handleSubcategoryChange}
              disabled={!categoryId}
              error={subcategoryError}
            />

            <Textarea
              label="Описание"
              placeholder="Коротко опишите, чему можете научить"
              value={description}
              onChange={handleDescriptionChange}
              error={descriptionError}
            />

            <ImageUpload
              images={images}
              error={imageError}
              uploadType="skillImages"
              onImagesChange={handleImagesChange}
              onError={setImageError}
              hint="Перетащите или выберите изображения навыка"
            />
          </div>

          <div className={styles.buttons}>
            <Button
              className={styles.button}
              type="button"
              variant="secondary"
              onClick={handleBack}
            >
              Назад
            </Button>

            <Button className={styles.button} type="submit">
              Продолжить
            </Button>
          </div>
        </form>
      </AuthLayout>

      {isConfirmationOpen &&
        confirmationSkill &&
        confirmationCategory &&
        confirmationSubcategory && (
          <SkillConfirmationModal
            images={confirmationSkill.imageUrls}
            title={confirmationSkill.title}
            category={confirmationCategory.name}
            subcategory={confirmationSubcategory.name}
            description={confirmationSkill.description}
            onEdit={handleEdit}
            onDone={handleDone}
          />
        )}
    </>
  )
}

export default RegistrationStep3
