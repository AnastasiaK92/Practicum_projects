import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillDetails } from './SkillDetails'

const meta: Meta<typeof SkillDetails> = {
  title: 'Entities/Skill/SkillDetails',
  component: SkillDetails,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '420px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: 'Название навыка',
    },
    category: {
      control: 'text',
      description: 'Категория навыка',
    },
    subcategory: {
      control: 'text',
      description: 'Подкатегория навыка',
    },
    description: {
      control: 'text',
      description: 'Описание навыка',
    },
  },
}

export default meta
type Story = StoryObj<typeof SkillDetails>

export const Default: Story = {
  args: {
    title: 'Игра на барабанах',
    category: 'Творчество и искусство',
    subcategory: 'Музыка и звук',
    description:
      'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без паритуры',
  },
}
