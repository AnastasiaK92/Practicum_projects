import type { Meta, StoryObj } from '@storybook/react-vite'

import { SkillTagsBlock } from './SkillTagsBlock'

const meta: Meta<typeof SkillTagsBlock> = {
  title: 'Entities/Skill/SkillTagsBlock',
  component: SkillTagsBlock,
}

export default meta

type Story = StoryObj<typeof SkillTagsBlock>

export const Default: Story = {
  args: {
    canTeach: {
      variant: 'languages',
      label: 'Английский язык',
    },
    wantsToLearn: [
      {
        variant: 'creative',
        label: 'Рисование',
      },
      {
        variant: 'business',
        label: 'Маркетинг',
      },
    ],
  },
}

export const WithManyTags: Story = {
  args: {
    canTeach: {
      variant: 'education',
      label: 'Математика',
    },
    wantsToLearn: [
      {
        variant: 'languages',
        label: 'Испанский',
      },
      {
        variant: 'creative',
        label: 'Фотография',
      },
      {
        variant: 'business',
        label: 'Финансы',
      },
      {
        variant: 'health',
        label: 'Медитация',
      },
      {
        variant: 'home',
        label: 'Садоводство',
      },
      {
        variant: 'languages',
        label: 'Немецкий язык',
      },
      {
        variant: 'education',
        label: 'История',
      },
    ],
  },
}

export const WithDifferentTagLengths: Story = {
  args: {
    canTeach: {
      variant: 'education',
      label: 'Математика',
    },
    wantsToLearn: [
      {
        variant: 'languages',
        label: 'C#',
      },
      {
        variant: 'creative',
        label: 'Рисование',
      },
      {
        variant: 'business',
        label: 'Маркетинг',
      },
      {
        variant: 'health',
        label: 'Физическая культура',
      },
      {
        variant: 'home',
        label: 'Садоводство',
      },
    ],
  },
}

export const WithNoTags: Story = {
  args: {
    canTeach: {
      variant: 'business',
      label: 'Управление проектами',
    },
    wantsToLearn: [],
  },
}

export const WithOneTag: Story = {
  args: {
    canTeach: {
      variant: 'creative',
      label: 'Фотография',
    },
    wantsToLearn: [
      {
        variant: 'languages',
        label: 'Испанский язык',
      },
    ],
  },
}
