import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillGallery } from './SkillGallery'

const meta: Meta<typeof SkillGallery> = {
  title: 'Entities/Skill/SkillGallery',
  component: SkillGallery,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof SkillGallery>

const imgs = [
  'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
  'https://images.unsplash.com/photo-1501612780327-45045538702b?w=400&q=80',
]

export const Default: Story = { args: { images: imgs } }

// История с 4 изображениями: 1 главное + 3 миниатюры (полный набор видимых элементов)
export const FourImages: Story = {
  args: { images: imgs.slice(0, 4) },
}

export const SingleImage: Story = { args: { images: [imgs[0]] } }
export const Empty: Story = { args: { images: [] } }
