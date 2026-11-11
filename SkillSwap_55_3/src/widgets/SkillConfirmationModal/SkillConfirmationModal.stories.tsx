import type { Meta, StoryObj } from '@storybook/react-vite'

import { SkillConfirmationModal } from './SkillConfirmationModal'

const meta = {
  title: 'Widgets/SkillConfirmationModal',
  component: SkillConfirmationModal,
  tags: ['autodocs'],
} satisfies Meta<typeof SkillConfirmationModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    images: [
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
    ],
    title: 'Игра на барабанах',
    category: 'Творчество и искусство',
    subcategory: 'Музыка и звук',
    description:
      'Привет! Я играю на барабанах уже больше 10 лет — от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без партитуры',
  },
}
