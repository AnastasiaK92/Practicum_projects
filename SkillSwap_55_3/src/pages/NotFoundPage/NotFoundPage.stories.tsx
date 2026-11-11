import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'

const meta = {
  title: 'Pages/NotFoundPage',
  component: NotFoundPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/not-found']}>
        <Routes>
          <Route path="/not-found" element={<Story />} />
          <Route path="/" element={<div>Главная страница</div>} />
        </Routes>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof NotFoundPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
