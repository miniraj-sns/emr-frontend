import { Appointment } from './appointment'

export interface Patient {
  id: number
  first_name: string
  last_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  gender?: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  patient_status: 'active' | 'non_active' | 'onboarding'
  patient_type: 'mindbrite' | 'evoke' | 'other'
  referring_provider_id?: number
  assigned_coach_id?: number
  notes?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  deleted_at?: string
  referring_provider?: User
  assigned_coach?: User
  vital_signs?: PatientVitalSigns[]
  medications?: PatientMedication[]
  appointments?: Appointment[]
  files?: PatientFile[]
  patient_notes?: PatientNote[]
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  roles?: string[]
}

export interface PatientVitalSigns {
  id: number
  patient_id: number
  recorded_by: number
  height?: string
  weight?: string
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  temperature?: number
  heart_rate?: number
  oxygen_saturation?: number
  respiratory_rate?: number
  recorded_at: string
  notes?: string
  created_at: string
  updated_at: string
  recorded_by_user?: User
}

export interface PatientMedication {
  id: number
  patient_id: number
  prescribed_by_user_id: number
  medication_name: string
  dosage: string
  frequency: string
  route?: string
  start_date?: string
  end_date?: string
  status: 'active' | 'discontinued' | 'completed'
  prescribed_by?: string
  pharmacy?: string
  refill_date?: string
  side_effects?: string
  notes?: string
  created_at: string
  updated_at: string
  prescribed_by_user?: User
}

export interface PatientListResponse {
  patients: Patient[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface PatientStatistics {
  by_status: {
    active: number
    non_active: number
    onboarding: number
  }
  by_type: {
    mindbrite: number
    evoke: number
    other: number
  }
}

export interface PatientFilters {
  search?: string
  status?: string
  type?: string
  page?: number
  per_page?: number
}

export interface CreatePatientRequest {
  first_name: string
  last_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  gender?: string
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  postal_code?: string
  country?: string
  patient_type?: 'mindbrite' | 'evoke' | 'other'
  patient_status?: 'active' | 'non_active' | 'onboarding'
  referring_provider_id?: number
  assigned_coach_id?: number
  notes?: string
  metadata?: Record<string, any>
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {}

export interface PatientNote {
  id: number
  patient_id: number
  author_user_id: number
  type?: string
  content: string
  is_provider_visible: boolean
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  author?: User
}

export interface PatientFile {
  id: number
  patient_id: number
  filename: string
  original_filename: string
  file_path: string
  file_type: string
  file_size: string
  mime_type: string
  uploaded_by_user_id: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  uploaded_by?: User
}

export interface PatientReport {
  id: number
  patient_id: number
  title: string
  content: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface PatientTimelineEvent {
  id: string
  event_type: 'appointment' | 'note' | 'file' | 'form' | 'report'
  event_date: string
  title: string
  description: string
  status: string
  metadata: Record<string, any>
  created_at: string
}

export interface PatientTimelineResponse {
  patient_id: number
  timeline: PatientTimelineEvent[]
}

export interface PatientTimelineFilters {
  start_date?: string
  end_date?: string
  type?: 'appointment' | 'note' | 'file' | 'form' | 'report'
} 