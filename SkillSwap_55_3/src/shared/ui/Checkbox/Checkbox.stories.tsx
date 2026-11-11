import type { Meta, StoryObj } from '@storybook/react-vite'

import { Checkbox } from './Checkbox'

// Meta описывает сам компонент для Storybook:
// где он будет находиться в меню, какой React-компонент отображать и какие пропсы использовать по умолчанию.
const meta = {
  // Путь в левом меню Storybook:
  // Shared -> Checkbox
  title: 'Shared/Checkbox',

  // Компонент, для которого создаются stories.
  component: Checkbox,

  // Базовые пропсы для всех stories ниже. Здесь задаём обязательный label один раз, чтобы не повторять его в каждой story.
  args: {
    label: 'Английский язык',
  },
} satisfies Meta<typeof Checkbox>

// Storybook ожидает meta как default export.
export default meta

// Тип отдельной story. Он строится на основе meta, поэтому Storybook и TypeScript знают, какие пропсы доступны у Checkbox.
type Story = StoryObj<typeof meta>

// Обычное состояние чекбокса.
export const Default: Story = {}

// Состояние с частичным выбором.
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

// Выбранный чекбокс.
export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

// Неактивный чекбокс.
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

// Неактивный выбранный чекбокс.
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
}
