import { DropdownContainer } from '@/shared/ui/DropdownContainer'
import LogoutIcon from '../../../shared/assets/icons/icon-logout.svg?react'
import styles from './ProfileMenuDropdown.module.css'
import { Button } from '@/shared/ui/Button'

interface ProfileMenuDropdownProps {
  onLogout?: () => void
}

export const ProfileMenuDropdown = ({ onLogout }: ProfileMenuDropdownProps) => {
  return (
    <DropdownContainer className={styles.dropdown}>
      <span>Личный кабинет</span>
      <Button
        variant="tertiary"
        size="sm"
        className={styles.logoutItem}
        onClick={onLogout}
        icon={<LogoutIcon />}
        iconPosition="right"
      >
        <span>Выйти из аккаунта</span>
        <LogoutIcon />
      </Button>
    </DropdownContainer>
  )
}
