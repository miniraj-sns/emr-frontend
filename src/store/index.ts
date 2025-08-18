import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import authReducer from '@/features/auth/authSlice'
import uiReducer from '@/features/ui/uiSlice'
import patientsReducer from '@/features/patients/patientsSlice'
import appointmentsReducer from '@/features/appointments/appointmentsSlice'
import crmReducer from '@/features/crm/crmSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    patients: patientsReducer,
    appointments: appointmentsReducer,
    crm: crmReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 