import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthLayout } from '@/widgets/AuthLayout'
import { RegistrationProgress } from '@/widgets/RegistrationProgress'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { ROUTES } from '@/shared/lib/constants'
import { validateEmail, validatePassword } from '@/shared/lib/validators'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateStep1Draft } from '@/store/slices/registrationSlice'

import LightBulbIllustration from '@/shared/assets/illustrations/illustration-light-bulb.svg?react'
import EyeIcon from '@/shared/assets/icons/icon-eye.svg?react'
import EyeSlashIcon from '@/shared/assets/icons/icon-eye-slash.svg?react'
import GoogleIcon from '@/shared/assets/icons/icon-google.svg?react'
import AppleIcon from '@/shared/assets/icons/icon-apple.svg?react'

import styles from './RegistrationStep1.module.css'

export interface RegistrationStep1Props {
  emailValue?: string
  passwordValue?: string
  emailError?: string
  passwordError?: string
}

export const RegistrationStep1 = ({
  emailValue = '',
  passwordValue = '',
  emailError: initialEmailError,
  passwordError: initialPasswordError,
}: RegistrationStep1Props) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const draft = useAppSelector((state) => state.registration.draft)

  // Draft имеет приоритет над демонстрационными значениями из Storybook.
  const [email, setEmail] = useState(draft.email ?? emailValue)
  const [password, setPassword] = useState(draft.password ?? passwordValue)
  const [emailError, setEmailError] = useState(initialEmailError)
  const [passwordError, setPasswordError] = useState(initialPasswordError)

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    setEmailError(undefined)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    setPasswordError(undefined)
  }

  // Сохраняет валидные данные первого шага и открывает второй шаг.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextEmailError = validateEmail(email)
    const nextPasswordError = validatePassword(password)

    setEmailError(nextEmailError?.message)
    setPasswordError(nextPasswordError?.message)

    if (nextEmailError || nextPasswordError) {
      return
    }

    dispatch(
      updateStep1Draft({
        email,
        password,
      }),
    )

    navigate(ROUTES.REGISTER_STEP_2)
  }

  const isPasswordValid = password.length > 0 && validatePassword(password) === null

  return (
    <AuthLayout
      topContent={<RegistrationProgress currentStep={1} />}
      infoBlockProps={{
        illustration: <LightBulbIllustration />,
        title: 'Добро пожаловать в SkillSwap!',
        description:
          'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
      }}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.formContent}>
          <div className={styles.socialButtons}>
            <Button variant="secondary" icon={<GoogleIcon />} className={styles.socialButton}>
              Продолжить с Google
            </Button>

            <Button variant="secondary" icon={<AppleIcon />} className={styles.socialButton}>
              Продолжить с Apple
            </Button>
          </div>

          <div className={styles.divider}>
            <span>или</span>
          </div>

          <div className={styles.inputs}>
            <Input
              type="email"
              label="Email"
              placeholder="Введите email"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
            />

            <div className={styles.passwordField}>
              <Input
                type="password"
                label="Пароль"
                placeholder="Придумайте надёжный пароль"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                helperText={isPasswordValid ? 'Надёжный' : undefined}
                helperTextTone="success"
                showPasswordIcon={<EyeIcon />}
                hidePasswordIcon={<EyeSlashIcon />}
              />

              <span className={styles.passwordHint}>Пароль: от 8 до 64 символов, заглавная и строчная буквы, цифра и специальный символ</span>
            </div>
          </div>
        </div>

        <Button type="submit" variant="primary">
          Далее
        </Button>
      </form>
    </AuthLayout>
  )
}
