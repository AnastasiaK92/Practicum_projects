import { useState } from 'react'
import { HeaderContainer } from '@/widgets/Header/HeaderContainer'
import { Footer } from '@/widgets/Footer'
import { ProfileSidebar } from '@/widgets/ProfileSidebar'
import {
  PersonalDataSection,
  type PersonalData,
} from '@/widgets/PersonalDataSection'
import { FavoritesSection } from '@/widgets/FavoritesSection'

import styles from './ProfilePage.module.css'

export type ProfileTab =
  | 'requests'
  | 'exchanges'
  | 'favorites'
  | 'skills'
  | 'personal'

export interface ProfilePageProps {
  /** Начальная вкладка (для Storybook и входа на страницу). */
  initialTab?: ProfileTab
}

const DEFAULT_TAB: ProfileTab = 'personal'

const AVATAR_SRC = '/images/users/user-001/avatar.webp'

const PROFILE_DATA: PersonalData = {
  email: 'Mariia@gmail.com',
  name: 'Мария',
  birthDate: new Date(1995, 9, 28),
  gender: 'female',
  city: 'moscow',
  about:
    'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
  avatar: AVATAR_SRC,
}

const PLACEHOLDER_TITLES: Record<Exclude<ProfileTab, 'personal' | 'favorites'>, string> = {
  requests: 'Заявки',
  exchanges: 'Мои обмены',
  skills: 'Мои навыки',
}

function PlaceholderBlock({ title }: { title: string }) {
  return (
    <div className={styles.placeholder}>
      <h2 className={styles.placeholderTitle}>{title}</h2>
      <p className={styles.placeholderText}>Раздел находится в разработке</p>
    </div>
  )
}

export default function ProfilePage({ initialTab = DEFAULT_TAB }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab)

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalDataSection data={PROFILE_DATA} />
      case 'favorites':
        return (
          <FavoritesSection
            favoriteUsers={[]}
            onFavoriteClick={() => {}}
            onDetailsClick={() => {}}
          />
        )
      case 'requests':
      case 'exchanges':
      case 'skills':
        return <PlaceholderBlock title={PLACEHOLDER_TITLES[activeTab]} />
    }
  }

  return (
    <div className={styles.page}>
      <HeaderContainer/>

      <main className={styles.main}>
        <div className={styles.profileGrid}>
          <ProfileSidebar
            activeTab={activeTab}
            onTabClick={(tabId) => setActiveTab(tabId as ProfileTab)}
          />

          <div className={styles.content}>{renderContent()}</div>
        </div>
      </main>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}
