import type { Meta, StoryObj } from '@storybook/react-vite'

import { SkillPage } from './SkillPage'
import { skillPageMock } from './SkillPage.mock'

const skillPageViewports = {
  skillPage: {
    name: 'SkillPage 1440 × 1372',
    styles: {
      width: '1440px',
      height: '1372px',
    },
    type: 'desktop',
  },
} as const

const meta = {
  title: 'Pages/SkillPage',
  component: SkillPage,

  parameters: {
    layout: 'fullscreen',

    viewport: {
      options: skillPageViewports,
    },
  },

  globals: {
    viewport: {
      value: 'skillPage',
      isRotated: false,
    },
  },
} satisfies Meta<typeof SkillPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: skillPageMock,
}
