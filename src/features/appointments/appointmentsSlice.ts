import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Appointment {
  id: number
  patient_id: number
  coach_user_id: number
  appointment_date: string
  appointment_time: string
  duration: number
  appointment_type: string
  status: string
  notes: string
  created_at: string
}

export interface AppointmentsState {
  list: Appointment[]
  selected: Appointment | null
  isLoading: boolean
  error: string | null
}

const initialState: AppointmentsState = {
  list: [],
  selected: null,
  isLoading: false,
  error: null,
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.list = action.payload
    },
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selected = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setAppointments, setSelectedAppointment, setLoading, setError } = appointmentsSlice.actions
export default appointmentsSlice.reducer 