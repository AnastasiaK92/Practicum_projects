import { SkillTagsBlock, type SkillTagsBlockProps } from '../../entities/skill/ui/SkillTagsBlock'
import { UserInfo, type UserInfoProps } from '../../entities/user/ui/UserInfo'

import styles from './UserProfileCard.module.css'

type UserProfileData = Pick<UserInfoProps, 'avatar' | 'name' | 'city' | 'age'>

export type UserProfileCardProps = {
  user: UserProfileData
  description: string
  skills: SkillTagsBlockProps
}

export const UserProfileCard = ({ user, description, skills }: UserProfileCardProps) => {
  return (
    <article className={styles.card}>
      {/* Основная информация о пользователе без кнопки избранного. */}
      <div className={styles.about}>
  <UserInfo {...user} withFavoriteButton={false} />

  {/* Публичный блок «О себе» не рендерим, если описание пустое (LOGIC-34). */}
  {description !== '' && <p className={styles.description}>{description}</p>}
</div>

      {/* Блок навыков использует готовый entity-компонент. */}
      <SkillTagsBlock {...skills} variant="spacious" />
    </article>
  )
}
