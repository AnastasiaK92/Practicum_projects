
import ErrorImage from '../../shared/assets/illustrations/illustration-error-500.svg'
import { Button } from '@/shared/ui/Button'
import { Footer } from '@/widgets/Footer'

import styles from './ServerErrorPage.module.css'
import { HeaderContainer } from '@/widgets/Header/HeaderContainer'


export function ServerErrorPage() {
  return (
    <div className={styles.page}>
      <HeaderContainer/>

      <main className={styles.main}>
        <div className={styles.error}>
          <img className={styles.image} src={ErrorImage} alt="Внутренняя ошибка сервера" />

          <div className={styles.content}>
            <div className={styles.text}>
              <h1>На сервере произошла ошибка</h1>
              <p>Попробуйте позже или вернитесь на главную страницу</p>
            </div>

            <div className={styles.buttons}>
              <Button variant="secondary" size="md">
                Сообщить об ошибке
              </Button>
              <Button variant="primary" size="md">
                На главную
              </Button>
            </div>
          </div>
        </div>
      </main>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}
