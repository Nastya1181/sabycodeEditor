import { configureStore } from '@reduxjs/toolkit'
import { sabycodeApi } from './api/sabycodeApi.js'
import authenticationReducer from './features/authentication/authenticationSlice.js'

export const rootStore = configureStore({
  reducer: {
    authentication: authenticationReducer,
    [sabycodeApi.reducerPath]: sabycodeApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sabycodeApi.middleware)
})