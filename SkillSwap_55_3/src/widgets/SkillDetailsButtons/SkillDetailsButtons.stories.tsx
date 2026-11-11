import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkillDetailsButtons } from './SkillDetailsButtons';

const meta: Meta<typeof SkillDetailsButtons> = {
  title: 'Widgets/SkillDetailsButtons',
  component: SkillDetailsButtons,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['offer', 'edit'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof SkillDetailsButtons>;

export const Offer: Story = {
  args: {
    variant: 'offer',
    onOffer: () => alert('Предложить обмен'),
  },
  decorators: [
  (Story) => (
    <div style={{ width: '400px' }}>
      <Story />
    </div>
  ),
],
};

export const Edit: Story = {
  args: {
    variant: 'edit',
    onEdit: () => alert('Редактировать'),
    onDone: () => alert('Готово'),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '420px' }}>
        <Story />
      </div>
    ),
  ],
}

export const OfferDisabled: Story = {
  args: {
    variant: 'offer',
    disabled: true,
  },
  decorators: [
  (Story) => (
    <div style={{ width: '400px' }}>
      <Story />
    </div>
  ),
],
};

export const EditDisabled: Story = {
  args: {
    variant: 'edit',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '420px' }}>
        <Story />
      </div>
    ),
  ],
}

export const BothStates: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      gap: '40px',
      alignItems: 'flex-start',
      flexWrap: 'wrap'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '400px',
        }}
      >
        <span style={{
          fontSize: '12px',
          color: '#69735D'
          }}>
            Offer</span>

        <SkillDetailsButtons
          variant="offer"
          onOffer={() => alert('Предложить обмен')}
        />
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '420px',
        }}
      >
        <span style={{ fontSize: '12px', color: '#69735D' }}>
          Edit / Done
          </span>

        <SkillDetailsButtons
          variant="edit"
          onEdit={() => alert('Редактировать')}
          onDone={() => alert('Готово')}
        />
      </div>
    </div>
  ),
};
