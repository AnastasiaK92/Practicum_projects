import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActiveFilterChip } from './ActiveFilterChip';

const meta: Meta<typeof ActiveFilterChip> = {
  title: 'Shared/ActiveFilterChip',
  component: ActiveFilterChip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    onRemove: { action: 'removed' },
  },
};

export default meta;
type Story = StoryObj<typeof ActiveFilterChip>;

export const Default: Story = {
  args: {
    label: 'Английский',
  },
};

export const WithoutRemove: Story = {
  args: {
    label: 'Без удаления',
    onRemove: undefined,
  },
};



export const MultipleChips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <ActiveFilterChip label="Категория: Бизнес" onRemove={() => {}} />
      <ActiveFilterChip label="Город: Москва" onRemove={() => {}} />
      <ActiveFilterChip label="Тип: Учу" onRemove={() => {}} />
    </div>
  ),
};