import { configureStore } from '@reduxjs/toolkit'
import { sabycodeApi } from './api/sabycodeApi.js'
import authenticationReducer from './features/authentication/authenticationSlice.js'
import usersReducer from './features/users/usersSlice.js'

export const rootStore = configureStore({
  reducer: {
    authentication: authenticationReducer,
    users: usersReducer,
    [sabycodeApi.reducerPath]: sabycodeApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sabycodeApi.middleware)
})