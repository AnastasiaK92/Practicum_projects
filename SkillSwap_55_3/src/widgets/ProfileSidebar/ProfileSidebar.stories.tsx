import { ProfileSidebar } from './ProfileSidebar';

export default {
  title: 'Widgets/ProfileSidebar',
  component: ProfileSidebar,
};

export const Default = {
  args: {
    activeTab: 'personal',
    onTabClick: (tabId: string) => console.log('Клик по вкладке:', tabId),
  },
};