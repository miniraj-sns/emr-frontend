import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Lead {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  status: string
  pipeline_id: number
  created_at: string
}

export interface CRMState {
  leads: Lead[]
  isLoading: boolean
  error: string | null
}

const initialState: CRMState = {
  leads: [],
  isLoading: false,
  error: null,
}

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setLeads, setLoading, setError } = crmSlice.actions
export default crmSlice.reducer 