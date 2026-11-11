import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import BookIcon from '../../shared/assets/icons/icon-book.svg?react'
import BriefcaseIcon from '../../shared/assets/icons/icon-briefcase.svg?react'
import GlobalIcon from '../../shared/assets/icons/icon-global.svg?react'
import HomeIcon from '../../shared/assets/icons/icon-home.svg?react'
import LifestyleIcon from '../../shared/assets/icons/icon-lifestyle.svg?react'
import PaletteIcon from '../../shared/assets/icons/icon-palette.svg?react'

import { CategoryItem } from './CategoryItem'
import type { CategoryItemVariant } from './CategoryItem'

const meta: Meta<typeof CategoryItem> = {
  title: 'Widgets/CategoryItem',
  component: CategoryItem,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof CategoryItem>

const categories: {
  icon: ReactNode
  title: string
  subcategories: string[]
  variant: CategoryItemVariant
}[] = [
  {
    icon: <BriefcaseIcon />,
    title: 'Бизнес и карьера',
    variant: 'business',
    subcategories: [
      'Управление командой',
      'Маркетинг и реклама',
      'Продажи и переговоры',
      'Личный бренд',
      'Резюме и собеседование',
      'Тайм-менеджмент',
      'Проектное управление',
      'Предпринимательство',
    ],
  },
  {
    icon: <PaletteIcon />,
    title: 'Творчество и искусство',
    variant: 'creative',
    subcategories: [
      'Рисование и иллюстрация',
      'Фотография',
      'Видеомонтаж',
      'Музыка и звук',
      'Актёрское мастерство',
      'Креативное письмо',
      'Арт-терапия',
      'Декор и DIY',
    ],
  },
  {
    icon: <GlobalIcon />,
    title: 'Иностранные языки',
    variant: 'languages',
    subcategories: [
      'Английский',
      'Французский',
      'Испанский',
      'Немецкий',
      'Китайский',
      'Японский',
      'Подготовка к экзаменам (IELTS, TOEFL)',
    ],
  },
  {
    icon: <BookIcon />,
    title: 'Образование и развитие',
    variant: 'education',
    subcategories: [
      'Личностное развитие',
      'Навыки обучения',
      'Когнитивные техники',
      'Скорочтение',
      'Навыки преподавания',
      'Коучинг',
    ],
  },
  {
    icon: <HomeIcon />,
    title: 'Дом и уют',
    variant: 'home',
    subcategories: [
      'Уборка и организация',
      'Домашние финансы',
      'Приготовление еды',
      'Домашние растения',
      'Ремонт',
      'Хранение вещей',
    ],
  },
  {
    icon: <LifestyleIcon />,
    title: 'Здоровье и лайфстайл',
    variant: 'health',
    subcategories: [
      'Йога и медитация',
      'Питание и ЗОЖ',
      'Ментальное здоровье',
      'Осознанность',
      'Физические тренировки',
      'Сон и восстановление',
      'Баланс жизни и работы',
    ],
  },
]
export const Default: Story = {
  args: categories[0],
}

export const AllCategories: Story = {
  render: () => (
    <>
      {/*
        Эта раскладка используется только для визуальной демонстрации в Storybook.
        CategoryItem отвечает только за отображение одной категории.
        Расположение нескольких CategoryItem относится к ответственности родительского компонента.
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 488px)',
          columnGap: '40px',
          rowGap: '40px',
        }}
      >
        {categories.map((category) => (
          <CategoryItem
            key={category.title}
            icon={category.icon}
            title={category.title}
            subcategories={category.subcategories}
            variant={category.variant}
          />
        ))}
      </div>
    </>
  ),
}
