import { UserSkillsSection } from './UserSkillsSection'

export default {
  title: 'Widgets/UserSkillsSection',
  component: UserSkillsSection,
}

export const Popular = {
  args: {
    title: 'Популярное',
    showViewAll: true,
    items: [
      {
        id: '7',
        name: 'Ольга',
        city: 'Ростов-на-Дону',
        age: 29,
        avatarUrl: 'https://randomuser.me/api/portraits/women/17.jpg',
        canTeach: { label: 'Фотография', variant: 'creative' },
        learnTags: [
          { label: 'Тайм менеджмент', variant: 'more' },
          { label: 'Медитация', variant: 'health' },
        ],
      },
      {
        id: '8',
        name: 'Дмитрий',
        city: 'Омск',
        age: 31,
        avatarUrl: 'https://randomuser.me/api/portraits/men/18.jpg',
        canTeach: { label: 'Гитара', variant: 'creative' },
        learnTags: [
          { label: 'Тайм менеджмент', variant: 'more' },
          { label: 'Медитация', variant: 'health' },
        ],
      },
      {
        id: '9',
        name: 'Светлана',
        city: 'Воронеж',
        age: 27,
        avatarUrl: 'https://randomuser.me/api/portraits/women/19.jpg',
        canTeach: { label: 'Йога', variant: 'health' },
        learnTags: [
          { label: 'Тайм менеджмент', variant: 'more' },
          { label: 'Медитация', variant: 'health' },
        ],
      },
    ],
    onFavoriteClick: (id: string) => console.log('Избранное:', id),
    onDetailsClick: (id: string) => console.log('Подробнее:', id),
  },
}

export const New = {
  args: {
    title: 'Новое',
    showViewAll: true,
    items: [
      {
        id: '10',
        name: 'Артём',
        city: 'Самара',
        age: 25,
        avatarUrl: 'https://randomuser.me/api/portraits/men/20.jpg',
        canTeach: { label: 'Дизайн', variant: 'creative' },
        learnTags: [
          { label: 'Тайм менеджмент', variant: 'more' },
          { label: 'Медитация', variant: 'health' },
        ],
      },
      {
        id: '11',
        name: 'Полина',
        city: 'Уфа',
        age: 24,
        avatarUrl: 'https://randomuser.me/api/portraits/women/21.jpg',
        canTeach: { label: 'Кулинария', variant: 'home' },
        learnTags: [
          { label: 'Тайм менеджмент', variant: 'more' },
          { label: 'Медитация', variant: 'health' },
        ],
      },
      {
        id: '12',
        name: 'Николай',
        city: 'Пермь',
        age: 36,
        avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
        canTeach: { label: 'Шахматы', variant: 'education' },
        learnTags: [
          { label: 'Тайм менеджмент', variant: 'more' },
          { label: 'Медитация', variant: 'health' },
        ],
      },
    ],
    onFavoriteClick: (id: string) => console.log('Избранное:', id),
    onDetailsClick: (id: string) => console.log('Подробнее:', id),
  },
}
export const HiddenViewAllButton = {
  args: {
    title: 'Секция без кнопки',
    showViewAll: false,
    items: [
      {
        id: '1',
        name: 'Иван',
        city: 'Санкт-Петербург',
        age: 34,
        avatarUrl: 'https://randomuser.me/api/portraits/men/11.jpg',
        canTeach: { label: 'Игра на барабанах', variant: 'more' },
        learnTags: [
          { label: 'Тайм менеджмент', variant: 'more' },
          { label: 'Медитация', variant: 'health' },
        ],
      },
      {
        id: '2',
        name: 'Анна',
        city: 'Казань',
        age: 26,
        avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
        canTeach: { label: 'Английский язык', variant: 'languages' },
        learnTags: [
          { label: 'Тайм менеджмент', variant: 'more' },
          { label: 'Медитация', variant: 'health' },
        ],
      },
      {
        id: '3',
        name: 'Максим',
        city: 'Москва',
        age: 23,
        avatarUrl: 'https://randomuser.me/api/portraits/men/13.jpg',
        canTeach: { label: 'Бизнес-план', variant: 'business' },
        learnTags: [
          { label: 'Тайм менеджмент', variant: 'more' },
          { label: 'Медитация', variant: 'health' },
        ],
      },
    ],
    onFavoriteClick: (id: string) => console.log('Избранное:', id),
    onDetailsClick: (id: string) => console.log('Подробнее:', id),
  },
}
