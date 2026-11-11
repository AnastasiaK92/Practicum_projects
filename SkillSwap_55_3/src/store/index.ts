import { configureStore } from '@reduxjs/toolkit'
import { listenerMiddleware } from './listenerMiddleware'
import authReducer from './slices/authSlice'
import catalogFiltersReducer from './slices/catalogFiltersSlice'
import favoritesReducer from './slices/favoritesSlice'
import notificationsReducer from './slices/notificationsSlice'
import registrationReducer from './slices/registrationSlice'
import requestsReducer from './slices/requestsSlice'
import usersReducer from './slices/usersSlice'

export const store = configureStore({
  reducer: {
    users: usersReducer,
    auth: authReducer,
    registration: registrationReducer,
    favorites: favoritesReducer,
    requests: requestsReducer,
    notifications: notificationsReducer,
    catalogFilters: catalogFiltersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
