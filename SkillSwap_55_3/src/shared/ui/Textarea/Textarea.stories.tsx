import { Textarea } from './Textarea';
import type { StoryFn } from '@storybook/react-vite';

export default {
  title: 'Shared/UI/Textarea',
  component: Textarea,
  decorators: [
    (Story: StoryFn) => (
      <div style={{ maxWidth: '436px' }}>
        <Story />
      </div>
    ),
  ],
}

export const Default = {
  args: {
    label: 'Описание',
    placeholder: 'Коротко опишите, чему можете научить',
  },
}

export const Error = {
  args: {
    label: 'Описание',
    placeholder: 'Коротко опишите, чему можете научить',
    error: 'Слишком короткое описание',
  },
}

export const Disabled = {
  args: {
    label: 'Описание',
    placeholder: 'Коротко опишите, чему можете научить',
    disabled: true,
  },
}
