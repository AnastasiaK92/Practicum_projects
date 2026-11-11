import { Footer } from '@/widgets/Footer'
import { Button } from '@/shared/ui/Button'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import Error404 from '../../shared/assets/illustrations/illustration-error-404.svg?react'
import styles from './NotFoundPage.module.css'
import { HeaderContainer } from '@/widgets/Header/HeaderContainer'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <HeaderContainer />
      <section className={styles.section}>
        <Error404 className={styles.error404image} />
        <h2 className={styles.message}>Страница не найдена</h2>
        <p className={styles.description}>
          К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже
        </p>
        <div className={styles.buttons}>
          <Button variant="secondary" className={styles.button}>
            Собщить об ошибке
          </Button>
          <Button className={styles.button} onClick={() => navigate(ROUTES.HOME)}>
            На главную
          </Button>
        </div>
      </section>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}
