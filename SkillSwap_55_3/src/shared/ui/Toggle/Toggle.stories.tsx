import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'shared/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const DisabledOff: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const DisabledOn: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

/** Интерактивная история: можно кликать и видеть переключение */
export const Interactive = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Toggle
      checked={checked}
      onChange={setChecked}
    />
  );
};