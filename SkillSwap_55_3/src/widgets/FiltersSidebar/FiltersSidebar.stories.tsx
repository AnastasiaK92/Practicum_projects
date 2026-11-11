import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  EMPTY_CATALOG_FILTERS,
  FiltersSidebar,
  type CatalogFilters,
  type FiltersSidebarProps,
} from '.'

const categories: FiltersSidebarProps['categories'] = [
  {
    id: 'business-career',
    name: 'Бизнес и карьера',
    subcategories: [
      { id: 'team-management', name: 'Управление командой' },
      { id: 'marketing-advertising', name: 'Маркетинг и реклама' },
      { id: 'sales-negotiations', name: 'Продажи и переговоры' },
      { id: 'personal-brand', name: 'Личный бренд' },
    ],
  },
  {
    id: 'creativity-art',
    name: 'Творчество и искусство',
    subcategories: [
      { id: 'drawing-illustration', name: 'Рисование и иллюстрация' },
      { id: 'photography', name: 'Фотография' },
      { id: 'video-editing', name: 'Видеомонтаж' },
      { id: 'music-sound', name: 'Музыка и звук' },
    ],
  },
]

const cities: FiltersSidebarProps['cities'] = [
  { id: 'moscow', name: 'Москва' },
  { id: 'saint-petersburg', name: 'Санкт-Петербург' },
  { id: 'novosibirsk', name: 'Новосибирск' },
  { id: 'yekaterinburg', name: 'Екатеринбург' },
  { id: 'kazan', name: 'Казань' },
]

// Хранит выбранные фильтры внутри демонстрационной истории.
function FiltersSidebarPreview(args: FiltersSidebarProps) {
  const [filters, setFilters] = useState<CatalogFilters>(args.filters)

  return <FiltersSidebar {...args} filters={filters} onChange={setFilters} />
}

const meta = {
  title: 'Widgets/FiltersSidebar',
  component: FiltersSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 284 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FiltersSidebar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    categories,
    cities,
    filters: EMPTY_CATALOG_FILTERS,
    onChange: () => {},
  },
  render: (args) => <FiltersSidebarPreview {...args} />,
}
