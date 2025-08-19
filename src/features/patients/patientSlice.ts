import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { 
  Patient, 
  PatientListResponse, 
  PatientStatistics, 
  PatientFilters,
  CreatePatientRequest,
  UpdatePatientRequest
} from '../../types/patient'
import patientService from '../../services/patientService'

// Async thunks
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (filters: PatientFilters = {}, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatients(filters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients')
    }
  }
)

export const fetchPatient = createAsyncThunk(
  'patients/fetchPatient',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatient(id)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient')
    }
  }
)

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData: CreatePatientRequest, { rejectWithValue }) => {
    try {
      const response = await patientService.createPatient(patientData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create patient')
    }
  }
)

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, patientData }: { id: number; patientData: UpdatePatientRequest }, { rejectWithValue }) => {
    try {
      const response = await patientService.updatePatient(id, patientData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient')
    }
  }
)

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id: number, { rejectWithValue }) => {
    try {
      await patientService.deletePatient(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete patient')
    }
  }
)

export const fetchPatientStatistics = createAsyncThunk(
  'patients/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatientStatistics()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics')
    }
  }
)

// State interface
interface PatientState {
  patients: Patient[]
  currentPatient: Patient | null
  statistics: PatientStatistics | null
  filters: PatientFilters
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  loading: {
    list: boolean
    detail: boolean
    create: boolean
    update: boolean
    delete: boolean
    statistics: boolean
  }
  error: string | null
}

// Initial state
const initialState: PatientState = {
  patients: [],
  currentPatient: null,
  statistics: null,
  filters: {
    search: '',
    status: '',
    type: '',
    page: 1,
    per_page: 15,
  },
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  },
  loading: {
    list: false,
    detail: false,
    create: false,
    update: false,
    delete: false,
    statistics: false,
  },
  error: null,
}

// Slice
const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<PatientFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    setCurrentPatient: (state, action: PayloadAction<Patient | null>) => {
      state.currentPatient = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearPatients: (state) => {
      state.patients = []
      state.currentPatient = null
    },
  },
  extraReducers: (builder) => {
    // Fetch patients
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading.list = true
        state.error = null
      })
      .addCase(fetchPatients.fulfilled, (state, action: PayloadAction<PatientListResponse>) => {
        state.loading.list = false
        state.patients = action.payload.patients
        state.pagination = action.payload.pagination
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading.list = false
        state.error = action.payload as string
      })

    // Fetch single patient
    builder
      .addCase(fetchPatient.pending, (state) => {
        state.loading.detail = true
        state.error = null
      })
      .addCase(fetchPatient.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading.detail = false
        state.currentPatient = action.payload
      })
      .addCase(fetchPatient.rejected, (state, action) => {
        state.loading.detail = false
        state.error = action.payload as string
      })

    // Create patient
    builder
      .addCase(createPatient.pending, (state) => {
        state.loading.create = true
        state.error = null
      })
      .addCase(createPatient.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading.create = false
        state.patients.unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading.create = false
        state.error = action.payload as string
      })

    // Update patient
    builder
      .addCase(updatePatient.pending, (state) => {
        state.loading.update = true
        state.error = null
      })
      .addCase(updatePatient.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.loading.update = false
        const index = state.patients.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.patients[index] = action.payload
        }
        if (state.currentPatient?.id === action.payload.id) {
          state.currentPatient = action.payload
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading.update = false
        state.error = action.payload as string
      })

    // Delete patient
    builder
      .addCase(deletePatient.pending, (state) => {
        state.loading.delete = true
        state.error = null
      })
      .addCase(deletePatient.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading.delete = false
        state.patients = state.patients.filter(p => p.id !== action.payload)
        if (state.currentPatient?.id === action.payload) {
          state.currentPatient = null
        }
        state.pagination.total -= 1
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading.delete = false
        state.error = action.payload as string
      })

    // Fetch statistics
    builder
      .addCase(fetchPatientStatistics.pending, (state) => {
        state.loading.statistics = true
        state.error = null
      })
      .addCase(fetchPatientStatistics.fulfilled, (state, action: PayloadAction<PatientStatistics>) => {
        state.loading.statistics = false
        state.statistics = action.payload
      })
      .addCase(fetchPatientStatistics.rejected, (state, action) => {
        state.loading.statistics = false
        state.error = action.payload as string
      })
  },
})

export const {
  setFilters,
  clearFilters,
  setCurrentPatient,
  clearError,
  clearPatients,
} = patientSlice.actions

export default patientSlice.reducer 