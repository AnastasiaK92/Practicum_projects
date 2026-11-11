import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Notification } from '@/shared/types'

export interface NotificationsState {
  items: Notification[]
}

// Задаёт пустой список уведомлений.
const initialState: NotificationsState = {
  items: [],
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Заменяет текущий список уведомлений.
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload
    },

    // Добавляет новое непрочитанное уведомление.
    addNotification(state, action: PayloadAction<string>) {
      state.items.push({
        requestId: action.payload,
        isRead: false,
      })
    },

    // Отмечает выбранное уведомление прочитанным.
    markNotificationAsRead(state, action: PayloadAction<string>) {
      const notification = state.items.find((item) => item.requestId === action.payload)

      if (notification) {
        notification.isRead = true
      }
    },

    // Очищает список уведомлений.
    clearNotifications(state) {
      state.items = []
    },
  },
})

export const { setNotifications, addNotification, markNotificationAsRead, clearNotifications } =
  notificationsSlice.actions

export default notificationsSlice.reducer
