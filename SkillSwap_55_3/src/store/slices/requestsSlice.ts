import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { SwapRequest } from '@/shared/types'

export interface RequestsState {
  items: SwapRequest[]
}

// Задаёт пустой список заявок.
const initialState: RequestsState = {
  items: [],
}

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    // Заменяет текущий список заявок.
    setRequests(state, action: PayloadAction<SwapRequest[]>) {
      state.items = action.payload
    },

    // Добавляет новую заявку.
    addRequest(state, action: PayloadAction<SwapRequest>) {
      state.items.push(action.payload)
    },

    // Удаляет заявку по идентификатору.
    removeRequest(state, action: PayloadAction<string>) {
      state.items = state.items.filter((request) => request.id !== action.payload)
    },

    // Очищает список заявок.
    clearRequests(state) {
      state.items = []
    },
  },
})

export const { setRequests, addRequest, removeRequest, clearRequests } = requestsSlice.actions

export default requestsSlice.reducer
