import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/lib/constants'
import styles from './Footer.module.css'
import { Logo } from '../../shared/ui/Logo'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <Logo />
          <nav className={styles.nav} aria-label="Навигация в подвале">
            <ul className={styles.menu}>
              <li>
                <Link to={ROUTES.ABOUT}>О проекте</Link>
              </li>
              <li>
                <a href="#">Все навыки</a>
              </li>
            </ul>

            <ul className={styles.menu}>
              <li>
                <a href="#">Контакты</a>
              </li>
              <li>
                <a href="#">Блог</a>
              </li>
            </ul>

            <ul className={styles.menu}>
              <li>
                <a href="#">Политика конфиденциальности</a>
              </li>
              <li>
                <a href="#">Пользовательское соглашение</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>SkillSwap — 2026</div>
      </div>
    </footer>
  )
}
