import type { Meta, StoryObj } from '@storybook/react-vite'
import { SkillActions } from './SkillActions'

const meta = {
  title: 'Widgets/SkillActions',
  component: SkillActions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SkillActions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onLike: () => console.log('Like clicked'),
    onShare: () => console.log('Share clicked'),
    onMore: () => console.log('More clicked'),
  },
}
