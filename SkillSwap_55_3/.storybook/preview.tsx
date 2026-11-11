import type { Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'

import { StoreProvider } from '../src/app/providers/StoreProvider'
import '../src/app/styles/global.css'

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <StoreProvider>
          <Story />
        </StoreProvider>
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
