import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../shared/ui/Button'
import { Input } from '../../shared/ui/Input'
import GoogleIcon from '../../shared/assets/icons/icon-google.svg?react'
import AppleIcon from '../../shared/assets/icons/icon-apple.svg?react'
import EyeIcon from '../../shared/assets/icons/icon-eye.svg?react'
import EyeOffIcon from '../../shared/assets/icons/icon-eye-slash.svg?react'
import LightBulb from '../../shared/assets/illustrations/illustration-light-bulb.svg?react'
import { AuthLayout } from '@/widgets/AuthLayout'
import { ROUTES } from '@/shared/lib/constants'
import { useAppDispatch } from '@/store/hooks'
import { login } from '@/store/thunks/login'
import styles from './LoginPage.module.css'

interface LoginPageProps {
  hasError?: boolean
}

export default function LoginPage({ hasError = false }: LoginPageProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isLoggedIn = dispatch(login({ email, password }))

    setLoginError(!isLoggedIn)

    if (isLoggedIn) {
      navigate(ROUTES.HOME)
    }
  }

  const showError = hasError || loginError

  return (
    <AuthLayout
      topContent={<h2 className={styles.header}>Вход</h2>}
      infoBlockProps={{
        illustration: <LightBulb />,
        title: 'С возвращением в SkillSwap!',
        description: 'Обменивайтесь знаниями и навыками с другими людьми',
      }}
    >
      <div className={styles.formSection}>
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
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input
            className={styles.input}
            label="Email"
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setLoginError(false)
            }}
            error={showError ? ' ' : undefined}
          />
          <Input
            className={styles.input}
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setLoginError(false)
            }}
            error={showError ? 'Email или пароль введен неверно.' : undefined}
            showPasswordIcon={<EyeIcon />}
            hidePasswordIcon={<EyeOffIcon />}
          />
          <Button className={styles.submitButton} type="submit">
            Войти
          </Button>
          <Link to={ROUTES.REGISTER} className={styles.registerLink}>
            Зарегистрироваться
          </Link>
        </form>
      </div>
    </AuthLayout>
  )
}
