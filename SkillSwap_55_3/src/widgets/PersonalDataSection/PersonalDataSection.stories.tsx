import type { Meta, StoryObj } from '@storybook/react-vite';
import { PersonalDataSection } from './PersonalDataSection';


const SAMPLE_AVATAR = 'https://picsum.photos/id/64/400/400';

const meta: Meta<typeof PersonalDataSection> = {
  title: 'Widgets/PersonalDataSection',
  component: PersonalDataSection,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'var(--color-background)',
          padding: '40px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta;
type Story = StoryObj<typeof PersonalDataSection>;

export const Default: Story = {
  args: {},
};

export const WithAvatar: Story = {
  args: {
    data: {
      email: 'Mariia@gmail.com',
      name: 'Мария',
      birthDate: new Date(1995, 9, 28),
      gender: 'female',
      city: 'moscow',
      about: 'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
      avatar: SAMPLE_AVATAR, 
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    data: {
      email: 'Mariia@gmail.com',
      name: 'Мария',
      birthDate: new Date(1995, 9, 28),
      gender: 'female',
      city: 'moscow',
      about: 'Люблю учиться новому, особенно если это можно делать за чаем и в пижаме. Всегда готова пообщаться и обменяться чем-то интересным!',
      avatar: SAMPLE_AVATAR,
    },
  },
};