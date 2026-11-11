import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillTag } from './SkillTag'

const meta: Meta<typeof SkillTag> = {
  title: 'Entities/Skill/SkillTag',
  component: SkillTag,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['languages', 'education', 'health', 'business', 'creative', 'home', 'more'],
    },
  },
}

export default meta
type Story = StoryObj<typeof SkillTag>

export const AllCategories: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <SkillTag label="Английский" variant="languages" />
      <SkillTag label="Личная эффективность" variant="education" />
      <SkillTag label="Йога" variant="health" />
      <SkillTag label="Маркетинг" variant="business" />
      <SkillTag label="Рисование" variant="creative" />
      <SkillTag label="Ремонт" variant="home" />
      <SkillTag label="+2" variant="more" />
    </div>
  ),
}
