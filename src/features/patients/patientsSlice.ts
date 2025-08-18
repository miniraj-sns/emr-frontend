import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Patient {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  status: string
  type: string
  created_at: string
}

export interface PatientsState {
  list: Patient[]
  selected: Patient | null
  isLoading: boolean
  error: string | null
}

const initialState: PatientsState = {
  list: [],
  selected: null,
  isLoading: false,
  error: null,
}

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.list = action.payload
    },
    setSelectedPatient: (state, action: PayloadAction<Patient | null>) => {
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

export const { setPatients, setSelectedPatient, setLoading, setError } = patientsSlice.actions
export default patientsSlice.reducer 