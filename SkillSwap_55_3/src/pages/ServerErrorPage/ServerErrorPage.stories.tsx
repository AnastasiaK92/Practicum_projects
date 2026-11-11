import type { Meta, StoryObj } from '@storybook/react-vite'

import { skillPageMock } from '../SkillPage/SkillPage.mock'

import { ServerErrorPage } from './ServerErrorPage'

const meta = {
  title: 'Pages/ServerErrorPage',
  component: ServerErrorPage,

  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ServerErrorPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    user: skillPageMock.user,
  },
}
