import { UserSkillCard } from './UserSkillCard';

export default {
  title: 'Widgets/UserSkillCard',
  component: UserSkillCard,
};

export const Default = {
  args: {
    user: {
      name: 'Иван',
      city: 'Санкт-Петербург',
      age: 34,
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      canTeach: { label: 'Английский язык', variant: 'languages' },
      learnTags: [
        { label: 'Тайм менеджмент', variant: 'more' },
        { label: 'Медитация', variant: 'health' },
      ],
    },
    onFavoriteClick: () => console.log('favorite clicked'),
    onDetailsClick: () => console.log('details clicked'),
  },
};
