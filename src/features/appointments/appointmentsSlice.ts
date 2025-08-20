import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { 
  Appointment, 
  AppointmentListResponse, 
  AppointmentStatistics, 
  AppointmentFilters,
  CreateAppointmentRequest,
  UpdateAppointmentRequest
} from '../../types/appointment'
import { appointmentService } from '../../services/appointmentService'

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (filters: AppointmentFilters = {}, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointments(filters)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments')
    }
  }
)

export const fetchAppointment = createAsyncThunk(
  'appointments/fetchAppointment',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointment(id)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointment')
    }
  }
)

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData: CreateAppointmentRequest, { rejectWithValue }) => {
    try {
      const response = await appointmentService.createAppointment(appointmentData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create appointment')
    }
  }
)

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ id, appointmentData }: { id: number; appointmentData: UpdateAppointmentRequest }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.updateAppointment(id, appointmentData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update appointment')
    }
  }
)

export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (id: number, { rejectWithValue }) => {
    try {
      await appointmentService.deleteAppointment(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete appointment')
    }
  }
)

export const assignCoach = createAsyncThunk(
  'appointments/assignCoach',
  async ({ id, coachId }: { id: number; coachId: number }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.assignCoach(id, coachId)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign coach')
    }
  }
)

export const rescheduleAppointment = createAsyncThunk(
  'appointments/rescheduleAppointment',
  async ({ id, scheduledAt }: { id: number; scheduledAt: string }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.rescheduleAppointment(id, scheduledAt)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reschedule appointment')
    }
  }
)

export const completeAppointment = createAsyncThunk(
  'appointments/completeAppointment',
  async ({ id, notes }: { id: number; notes?: string }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.completeAppointment(id, notes)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete appointment')
    }
  }
)

export const noShowAppointment = createAsyncThunk(
  'appointments/noShowAppointment',
  async ({ id, notes }: { id: number; notes?: string }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.noShowAppointment(id, notes)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark appointment as no-show')
    }
  }
)

export const fetchAppointmentStatistics = createAsyncThunk(
  'appointments/fetchAppointmentStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentStatistics()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointment statistics')
    }
  }
)

// State interface
interface AppointmentState {
  appointments: Appointment[]
  currentAppointment: Appointment | null
  statistics: AppointmentStatistics | null
  filters: AppointmentFilters
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
const initialState: AppointmentState = {
  appointments: [],
  currentAppointment: null,
  statistics: null,
  filters: {
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
const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<AppointmentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    setCurrentAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.currentAppointment = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearAppointments: (state) => {
      state.appointments = []
      state.currentAppointment = null
    },
  },
  extraReducers: (builder) => {
    // Fetch appointments
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading.list = true
        state.error = null
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<AppointmentListResponse>) => {
        state.loading.list = false
        state.appointments = action.payload.appointments
        state.pagination = action.payload.pagination
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading.list = false
        state.error = action.payload as string
      })

    // Fetch single appointment
    builder
      .addCase(fetchAppointment.pending, (state) => {
        state.loading.detail = true
        state.error = null
      })
      .addCase(fetchAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading.detail = false
        state.currentAppointment = action.payload
      })
      .addCase(fetchAppointment.rejected, (state, action) => {
        state.loading.detail = false
        state.error = action.payload as string
      })

    // Create appointment
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading.create = true
        state.error = null
      })
      .addCase(createAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading.create = false
        state.appointments.unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading.create = false
        state.error = action.payload as string
      })

    // Update appointment
    builder
      .addCase(updateAppointment.pending, (state) => {
        state.loading.update = true
        state.error = null
      })
      .addCase(updateAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.loading.update = false
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id)
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading.update = false
        state.error = action.payload as string
      })

    // Delete appointment
    builder
      .addCase(deleteAppointment.pending, (state) => {
        state.loading.delete = true
        state.error = null
      })
      .addCase(deleteAppointment.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading.delete = false
        state.appointments = state.appointments.filter(apt => apt.id !== action.payload)
        state.pagination.total -= 1
        if (state.currentAppointment?.id === action.payload) {
          state.currentAppointment = null
        }
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading.delete = false
        state.error = action.payload as string
      })

    // Assign coach
    builder
      .addCase(assignCoach.fulfilled, (state, action: PayloadAction<Appointment>) => {
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id)
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload
        }
      })

    // Reschedule appointment
    builder
      .addCase(rescheduleAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id)
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload
        }
      })

    // Complete appointment
    builder
      .addCase(completeAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id)
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload
        }
      })

    // No-show appointment
    builder
      .addCase(noShowAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id)
        if (index !== -1) {
          state.appointments[index] = action.payload
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload
        }
      })

    // Fetch statistics
    builder
      .addCase(fetchAppointmentStatistics.pending, (state) => {
        state.loading.statistics = true
        state.error = null
      })
      .addCase(fetchAppointmentStatistics.fulfilled, (state, action: PayloadAction<AppointmentStatistics>) => {
        state.loading.statistics = false
        state.statistics = action.payload
      })
      .addCase(fetchAppointmentStatistics.rejected, (state, action) => {
        state.loading.statistics = false
        state.error = action.payload as string
      })
  }
})

export const { 
  setFilters, 
  clearFilters, 
  setCurrentAppointment, 
  clearError, 
  clearAppointments 
} = appointmentsSlice.actions

export default appointmentsSlice.reducer 