import type { Meta, StoryObj } from '@storybook/react-vite'

import { Modal } from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof Modal>

export const Default: Story = {
  render: () => (
    <Modal>
      <h2>Подзаголовок</h2>
      <p>Вы уверены, что хотите продолжить? Это действие может быть необратимым.</p>
      <button type="button">Подтвердить</button>
    </Modal>
  ),
}
