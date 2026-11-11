import { SidebarItem } from './SidebarItem/SidebarItem';

import RequestIcon from '@/shared/assets/icons/icon-request.svg?react';
import MessageIcon from '@/shared/assets/icons/icon-message-text.svg?react';
import LikeIcon from '@/shared/assets/icons/icon-like.svg?react';
import IdeaIcon from '@/shared/assets/icons/icon-idea.svg?react';
import UserIcon from '@/shared/assets/icons/icon-user.svg?react';

import styles from './ProfileSidebar.module.css';

export interface ProfileSidebarProps {
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

const menuItems = [
  { id: 'requests', label: 'Заявки', icon: <RequestIcon /> },
  { id: 'exchanges', label: 'Мои обмены', icon: <MessageIcon /> },
  { id: 'favorites', label: 'Избранное', icon: <LikeIcon /> },
  { id: 'skills', label: 'Мои навыки', icon: <IdeaIcon /> },
  { id: 'personal', label: 'Личные данные', icon: <UserIcon /> },
]


export const ProfileSidebar = ({ activeTab, onTabClick }: ProfileSidebarProps) => {
  return (
    <div className={styles.sidebar}>
      {menuItems.map((item) => (
        <SidebarItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={item.id === activeTab}
          onClick={() => onTabClick(item.id)}
        />
      ))}
    </div>
  )
}