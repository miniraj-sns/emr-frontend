export interface Appointment {
  id: number
  patient_id: number
  coach_id?: number
  provider_id?: number
  facility_id?: number
  location_id?: number
  scheduled_at: string
  duration_minutes: number
  type: 'coaching' | 'onboarding' | 'support'
  status: 'scheduled' | 'completed' | 'no_show' | 'canceled' | 'rescheduled'
  notes?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  deleted_at?: string
  patient?: Patient
  coach?: User
  provider?: User
  facility?: Facility
  location?: Location
}

export interface Patient {
  id: number
  first_name: string
  last_name: string
  email?: string
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
}

export interface Facility {
  id: number
  name: string
  color?: string
}

export interface Location {
  id: number
  name: string
  city?: string
  state?: string
  location_type: string
}

export interface AppointmentListResponse {
  appointments: Appointment[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  } | null
}

export interface AppointmentFilters {
  patient_id?: number
  coach_id?: number
  provider_id?: number
  status?: string
  type?: string
  date_from?: string
  date_to?: string
  search?: string
  page?: number
  per_page?: number | string
}

export interface CreateAppointmentRequest {
  patient_id: number
  coach_id?: number
  provider_id?: number
  facility_id?: number
  location_id?: number
  scheduled_at: string
  duration_minutes?: number
  type: 'coaching' | 'onboarding' | 'support'
  notes?: string
  metadata?: Record<string, any>
}

export interface UpdateAppointmentRequest {
  coach_id?: number
  provider_id?: number
  facility_id?: number
  location_id?: number
  scheduled_at?: string
  duration_minutes?: number
  type?: 'coaching' | 'onboarding' | 'support'
  status?: 'scheduled' | 'completed' | 'no_show' | 'canceled' | 'rescheduled'
  notes?: string
  metadata?: Record<string, any>
}

export interface AppointmentStatistics {
  total: number
  scheduled: number
  completed: number
  no_show: number
  canceled: number
  by_type: {
    coaching: number
    onboarding: number
    support: number
  }
  by_coach: Record<string, number>
  by_provider: Record<string, number>
}
