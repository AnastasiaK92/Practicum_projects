import type { Meta, StoryObj } from '@storybook/react-vite'
import { AuthLayout } from './AuthLayout'
import { AuthInfoBlockProps } from '../AuthInfoBlock'
import { RegistrationProgress } from '../RegistrationProgress'
import LightBulb from '../../shared/assets/illustrations/illustration-light-bulb.svg'

const meta: Meta<typeof AuthLayout> = {
  title: 'Widgets/AuthLayout',
  component: AuthLayout,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof AuthLayout>

const loginInfo: AuthInfoBlockProps = {
  illustration: <img src={LightBulb} alt="" />,
  title: 'С возвращением в SkillSwap!',
  description: 'Обменивайтесь знаниями и навыками с другими людьми',
}

const registrationInfo: AuthInfoBlockProps = {
  illustration: <img src={LightBulb} alt="" />,
  title: 'Присоединяйтесь к сообществу',
  description: 'Начните обмениваться навыками уже сегодня',
}

export const LoginPage: Story = {
  args: {
    topContent: (
      <h2 style={{ margin: 0, fontSize: 'var(--font-size-h2)', minHeight: '28px' }}>Вход</h2>
    ),
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Введите email"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        <div>
          <label>Пароль</label>
          <input
            type="password"
            placeholder="Введите ваш пароль"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        <button
          style={{
            padding: '0.75rem',
            background: '#136e2c',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
          }}
        >
          Войти
        </button>
        <div style={{ textAlign: 'center' }}>
          <a href="#">Зарегистрироваться</a>
        </div>
      </div>
    ),
    infoBlockProps: loginInfo,
  },
}

export const RegistrationStep: Story = {
  args: {
    topContent: <RegistrationProgress currentStep={2} />,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Навыки</label>
          <input
            type="text"
            placeholder="Введите ваши навыки"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>
        <div>
          <label>О себе</label>
          <textarea
            placeholder="Расскажите о себе"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', minHeight: '100px' }}
          />
        </div>
        <button
          style={{
            padding: '0.75rem',
            background: '#136e2c',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
          }}
        >
          Далее
        </button>
      </div>
    ),
    infoBlockProps: registrationInfo,
  },
}
