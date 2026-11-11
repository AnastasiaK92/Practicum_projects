import type { Meta, StoryObj } from '@storybook/react-vite'

import { AllSkillsDropdown } from './AllSkillsDropdown'

const meta: Meta<typeof AllSkillsDropdown> = {
  title: 'Widgets/AllSkillsDropdown',
  component: AllSkillsDropdown,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof AllSkillsDropdown>

export const Default: Story = {
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: '1136px',
          minHeight: '1040px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}
