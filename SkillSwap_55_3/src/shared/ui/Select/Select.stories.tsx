import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select, type SelectOption } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Shared/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '206px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    placeholder: { control: 'text' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    options: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;


const defaultOptions: SelectOption[] = [
  { value: 'option1', label: 'Опция 1' },
  { value: 'option2', label: 'Опция 2' },
  { value: 'option3', label: 'Опция 3' },
];

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return <Select {...args} value={value} onChange={setValue} />;
  },
  args: {
    options: defaultOptions,
    placeholder: 'Выберите значение',
  },
};

export const WithLabel: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return <Select {...args} value={value} onChange={setValue} />;
  },
  args: {
    options: defaultOptions,
    placeholder: 'Выберите значение',
    label: 'Категория',
  },
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return <Select {...args} value={value} onChange={setValue} />;
  },
  args: {
    options: defaultOptions,
    placeholder: 'Выберите значение',
    label: 'Категория',
    error: 'Пожалуйста, выберите значение',
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('option1');
    return <Select {...args} value={value} onChange={setValue} disabled />;
  },
  args: {
    options: defaultOptions,
    placeholder: 'Выберите значение',
    label: 'Категория',
  },
};

export const Gender: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return <Select {...args} value={value} onChange={setValue} />;
  },
  args: {
    options: [
      { value: '', label: 'Не указан' },
      { value: 'male', label: 'Мужской' },
      { value: 'female', label: 'Женский' },
    ],
    placeholder: 'Не указан',
    label: 'Пол',
  },
};