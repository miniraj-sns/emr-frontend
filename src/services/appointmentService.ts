import axios from 'axios'
import { 
  Appointment, 
  AppointmentListResponse, 
  AppointmentStatistics, 
  AppointmentFilters,
  CreateAppointmentRequest,
  UpdateAppointmentRequest
} from '../types/appointment'
import { Location } from './locationService'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Create axios instance with auth headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const appointmentService = {
  // Get all appointments with filters and pagination
  async getAppointments(filters: AppointmentFilters = {}): Promise<AppointmentListResponse> {
    const params = new URLSearchParams()
    
    if (filters.patient_id) params.append('patient_id', filters.patient_id.toString())
    if (filters.coach_id) params.append('coach_id', filters.coach_id.toString())
    if (filters.provider_id) params.append('provider_id', filters.provider_id.toString())
    if (filters.status) params.append('status', filters.status)
    if (filters.type) params.append('type', filters.type)
    if (filters.date_from) params.append('date_from', filters.date_from)
    if (filters.date_to) params.append('date_to', filters.date_to)
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const response = await apiClient.get(`/appointments?${params.toString()}`)
    return response.data
  },

  // Get single appointment by ID
  async getAppointment(id: number): Promise<Appointment> {
    const response = await apiClient.get(`/appointments/${id}`)
    return response.data
  },

  // Create new appointment
  async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.post('/appointments', appointmentData)
    return response.data
  },

  // Update appointment
  async updateAppointment(id: number, appointmentData: UpdateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.put(`/appointments/${id}`, appointmentData)
    return response.data
  },

  // Delete appointment
  async deleteAppointment(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/appointments/${id}`)
    return response.data
  },

  // Assign coach to appointment
  async assignCoach(id: number, coachId: number): Promise<Appointment> {
    const response = await apiClient.patch(`/appointments/${id}/assign-coach`, { coach_id: coachId })
    return response.data
  },

  // Reschedule appointment
  async rescheduleAppointment(id: number, scheduledAt: string): Promise<Appointment> {
    const response = await apiClient.patch(`/appointments/${id}/reschedule`, { scheduled_at: scheduledAt })
    return response.data
  },

  // Complete appointment
  async completeAppointment(id: number, notes?: string): Promise<Appointment> {
    const response = await apiClient.patch(`/appointments/${id}/complete`, { notes })
    return response.data
  },

  // Mark appointment as no-show
  async noShowAppointment(id: number, notes?: string): Promise<Appointment> {
    const response = await apiClient.patch(`/appointments/${id}/no-show`, { notes })
    return response.data
  },

  // Get appointment statistics
  async getAppointmentStatistics(): Promise<AppointmentStatistics> {
    const response = await apiClient.get('/appointments/statistics')
    return response.data
  },

  // Get appointments for a specific patient
  async getPatientAppointments(patientId: number, filters: AppointmentFilters = {}): Promise<AppointmentListResponse> {
    return this.getAppointments({ ...filters, patient_id: patientId })
  },

  // Get upcoming appointments
  async getUpcomingAppointments(filters: AppointmentFilters = {}): Promise<AppointmentListResponse> {
    const today = new Date().toISOString().split('T')[0]
    return this.getAppointments({ 
      ...filters, 
      date_from: today,
      status: 'scheduled'
    })
  },

  // Get past appointments
  async getPastAppointments(filters: AppointmentFilters = {}): Promise<AppointmentListResponse> {
    const today = new Date().toISOString().split('T')[0]
    return this.getAppointments({ 
      ...filters, 
      date_to: today,
      status: ['completed', 'no_show', 'canceled']
    })
  },

  // Get locations for a specific facility
  async getFacilityLocations(facilityId: number): Promise<{ locations: Location[] }> {
    const response = await apiClient.get(`/facilities/${facilityId}/locations`)
    return response.data
  },

  // Check for appointment conflicts
  async checkConflict(conflictData: {
    scheduled_at: string
    end_time: string
    facility_id?: number
    location_id?: number
    provider_id?: number
    appointment_id?: number
  }): Promise<{ hasConflict: boolean; conflictingAppointments?: Appointment[] }> {
    const response = await apiClient.post('/appointments/check-conflict', conflictData)
    return response.data
  }
}
