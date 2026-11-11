import type { Meta, StoryObj } from '@storybook/react-vite'
import { DropdownContainer } from './index'
import React from 'react'

const meta: Meta<typeof DropdownContainer> = {
  title: 'Shared/UI/DropdownContainer',
  component: DropdownContainer,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof DropdownContainer>

const dropdownDemoStyle: React.CSSProperties = {
  top: '100%',
  right: 0,
  maxWidth: '70vw',
}

const DemoWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: 'relative',
      display: 'inline-block',
      padding: '10px',
      background: '#b6b6b7',
      borderRadius: '5px',
      border: '1px solid #000',
    }}
  >
    <button>Элемент-родитель</button>
    {children}
  </div>
)

export const Default: Story = {
  decorators: [
    (Story) => (
      <DemoWrapper>
        <Story />
      </DemoWrapper>
    ),
  ],
  render: (args) => (
    <DropdownContainer {...args} style={dropdownDemoStyle}>
      <h4 style={{ margin: 0, marginBottom: '12px' }}>Новые уведомления</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>Татьяна предлагает вам обмен</div>
      </div>
    </DropdownContainer>
  ),
}

export const ComplexNotificationList: Story = {
  decorators: [
    (Story) => (
      <DemoWrapper>
        <Story />
      </DemoWrapper>
    ),
  ],
  render: (args) => (
    <DropdownContainer
      {...args}
      style={{
        ...dropdownDemoStyle,
        width: '50vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ margin: 0 }}>Новые уведомления</h3>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#00b606',
            cursor: 'pointer',
          }}
        >
          Прочитать все
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#eee',
            }}
          />

          <div style={{ flex: 1 }}>
            <div>Николай принял ваш обмен</div>
            <div style={{ color: '#777', fontSize: '12px' }}>
              Перейдите в профиль, чтобы обсудить детали
            </div>
          </div>

          <span style={{ color: '#777', fontSize: '12px' }}>сегодня</span>
        </div>
      </div>
    </DropdownContainer>
  ),
}
