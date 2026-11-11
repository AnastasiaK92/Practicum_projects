import type { Meta, StoryObj } from '@storybook/react-vite';

import SchoolBoard from '../../shared/assets/illustrations/illustration-school-board.svg?react';
import UserInfo from '../../shared/assets/illustrations/illustration-user-info.svg?react';
import LightBulb from '../../shared/assets/illustrations/illustration-light-bulb.svg';

import { AuthInfoBlock } from './AuthInfoBlock';

const meta = {
  title: 'Widgets/AuthInfoBlock',
  component: AuthInfoBlock,
  parameters: {
    layout: 'centered',
  },
  args: {
    title: 'Заголовок',
    description: 'Описание информационного блока',
  },
} satisfies Meta<typeof AuthInfoBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SchoolBoardIllustration: Story = {
  name: 'School Board',
  args: {
    illustration: <SchoolBoard />,
    title: 'Учитесь с удовольствием',
    description:
      'Получайте новые знания и развивайте свои навыки вместе с нами.',
  },
};

export const UserInfoIllustration: Story = {
  name: 'User Info',
  args: {
    illustration: <UserInfo />,
    title: 'Расскажите о себе',
    description:
      'Заполните информацию о себе, чтобы сделать обучение более персональным.',
  },
};

export const LightBulbIllustration: Story = {
  name: 'Light Bulb',
  args: {
    illustration: <img src={LightBulb} alt="" />,
    title: 'Новые возможности',
    description:
      'Открывайте новые возможности для обучения и профессионального развития.',
  },
};
