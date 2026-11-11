import iconLogo from '../../assets/icons/icon-logo.svg'
import styles from './Logo.module.css'

export const Logo = () => {
  return (
    <div className={styles.logo}>
      <img className={styles.icon} src={iconLogo} alt="" />
      <span className={styles.text}>SkillSwap</span>
    </div>
  )
}
