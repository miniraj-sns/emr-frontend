import axios from 'axios'
import { 
  Patient, 
  PatientListResponse, 
  PatientStatistics, 
  PatientFilters,
  CreatePatientRequest,
  UpdatePatientRequest,
  PatientNote,
  PatientFile,
  PatientReport,
  PatientVitalSigns,
  PatientMedication
} from '../types/patient'

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
  const token = localStorage.getItem('user_token') // Changed from 'access_token'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const patientService = {
  // Get all patients with filters and pagination
  async getPatients(filters: PatientFilters = {}): Promise<PatientListResponse> {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.type) params.append('type', filters.type)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const response = await apiClient.get(`/patients?${params.toString()}`)
    return response.data
  },

  // Get single patient by ID
  async getPatient(id: number): Promise<Patient> {
    const response = await apiClient.get(`/patients/${id}`)
    return response.data
  },

  // Create new patient
  async createPatient(patientData: CreatePatientRequest): Promise<Patient> {
    const response = await apiClient.post('/patients', patientData)
    return response.data
  },

  // Update patient
  async updatePatient(id: number, patientData: UpdatePatientRequest): Promise<Patient> {
    const response = await apiClient.put(`/patients/${id}`, patientData)
    return response.data
  },

  // Delete patient
  async deletePatient(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/patients/${id}`)
    return response.data
  },

  // Update patient status
  async updatePatientStatus(id: number, status: string): Promise<Patient> {
    const response = await apiClient.patch(`/patients/${id}/status`, { patient_status: status })
    return response.data
  },

  // Update patient type
  async updatePatientType(id: number, type: string): Promise<Patient> {
    const response = await apiClient.patch(`/patients/${id}/type`, { patient_type: type })
    return response.data
  },

  // Get patient statistics
  async getPatientStatistics(): Promise<PatientStatistics> {
    const response = await apiClient.get('/patients/statistics')
    return response.data
  },

  // Patient Notes
  async getPatientNotes(patientId: number): Promise<PatientNote[]> {
    const response = await apiClient.get(`/patients/${patientId}/notes`)
    return response.data
  },

  async createPatientNote(patientId: number, noteData: { type?: string; content: string; is_provider_visible?: boolean }): Promise<PatientNote> {
    const response = await apiClient.post(`/patients/${patientId}/notes`, noteData)
    return response.data
  },

  async updatePatientNote(patientId: number, noteId: number, noteData: { type?: string; content: string; is_provider_visible?: boolean }): Promise<PatientNote> {
    const response = await apiClient.put(`/patients/${patientId}/notes/${noteId}`, noteData)
    return response.data
  },

  async deletePatientNote(patientId: number, noteId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/patients/${patientId}/notes/${noteId}`)
    return response.data
  },

  // Patient Files
  async getPatientFiles(patientId: number): Promise<PatientFile[]> {
    const response = await apiClient.get(`/patients/${patientId}/files`)
    return response.data
  },

  async uploadPatientFile(patientId: number, file: File): Promise<PatientFile> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post(`/patients/${patientId}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async deletePatientFile(patientId: number, fileId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/patients/${patientId}/files/${fileId}`)
    return response.data
  },

  // Patient Reports
  async getPatientReports(patientId: number): Promise<PatientReport[]> {
    const response = await apiClient.get(`/patients/${patientId}/reports`)
    return response.data
  },

  async createPatientReport(patientId: number, reportData: { title: string; content: string }): Promise<PatientReport> {
    const response = await apiClient.post(`/patients/${patientId}/reports`, reportData)
    return response.data
  },

  async updatePatientReport(patientId: number, reportId: number, reportData: { title?: string; content?: string }): Promise<PatientReport> {
    const response = await apiClient.put(`/patients/${patientId}/reports/${reportId}`, reportData)
    return response.data
  },

  async deletePatientReport(patientId: number, reportId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/patients/${patientId}/reports/${reportId}`)
    return response.data
  },

  async publishPatientReport(patientId: number, reportId: number): Promise<PatientReport> {
    const response = await apiClient.post(`/patients/${patientId}/reports/${reportId}/publish`)
    return response.data
  },

  // Patient Vital Signs
  async getPatientVitalSigns(patientId: number): Promise<{ vital_signs: PatientVitalSigns[]; latest: PatientVitalSigns | null }> {
    const response = await apiClient.get(`/patients/${patientId}/vital-signs`)
    return response.data
  },

  async createPatientVitalSigns(patientId: number, vitalSignsData: {
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
  }): Promise<PatientVitalSigns> {
    const response = await apiClient.post(`/patients/${patientId}/vital-signs`, vitalSignsData)
    return response.data
  },

  async updatePatientVitalSigns(patientId: number, vitalSignsId: number, vitalSignsData: {
    height?: string
    weight?: string
    blood_pressure_systolic?: number
    blood_pressure_diastolic?: number
    temperature?: number
    heart_rate?: number
    oxygen_saturation?: number
    respiratory_rate?: number
    recorded_at?: string
    notes?: string
  }): Promise<PatientVitalSigns> {
    const response = await apiClient.put(`/patients/${patientId}/vital-signs/${vitalSignsId}`, vitalSignsData)
    return response.data
  },

  async deletePatientVitalSigns(patientId: number, vitalSignsId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/patients/${patientId}/vital-signs/${vitalSignsId}`)
    return response.data
  },

  // Patient Medications
  async getPatientMedications(patientId: number): Promise<{
    medications: PatientMedication[]
    active_medications: PatientMedication[]
    discontinued_medications: PatientMedication[]
  }> {
    const response = await apiClient.get(`/patients/${patientId}/medications`)
    return response.data
  },

  async createPatientMedication(patientId: number, medicationData: {
    medication_name: string
    dosage: string
    frequency: string
    route?: string
    start_date?: string
    end_date?: string
    status?: 'active' | 'discontinued' | 'completed'
    prescribed_by?: string
    pharmacy?: string
    refill_date?: string
    side_effects?: string
    notes?: string
  }): Promise<PatientMedication> {
    const response = await apiClient.post(`/patients/${patientId}/medications`, medicationData)
    return response.data
  },

  async updatePatientMedication(patientId: number, medicationId: number, medicationData: {
    medication_name?: string
    dosage?: string
    frequency?: string
    route?: string
    start_date?: string
    end_date?: string
    status?: 'active' | 'discontinued' | 'completed'
    prescribed_by?: string
    pharmacy?: string
    refill_date?: string
    side_effects?: string
    notes?: string
  }): Promise<PatientMedication> {
    const response = await apiClient.put(`/patients/${patientId}/medications/${medicationId}`, medicationData)
    return response.data
  },

  async deletePatientMedication(patientId: number, medicationId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/patients/${patientId}/medications/${medicationId}`)
    return response.data
  },

  // Patient Timeline
  async getPatientTimeline(patientId: number, filters?: {
    start_date?: string
    end_date?: string
    type?: 'appointment' | 'note' | 'file' | 'form' | 'report'
  }): Promise<{
    patient_id: number
    timeline: Array<{
      id: string
      event_type: 'appointment' | 'note' | 'file' | 'form' | 'report'
      event_date: string
      title: string
      description: string
      status: string
      metadata: Record<string, any>
      created_at: string
    }>
  }> {
    const params = new URLSearchParams()
    
    if (filters?.start_date) params.append('start_date', filters.start_date)
    if (filters?.end_date) params.append('end_date', filters.end_date)
    if (filters?.type) params.append('type', filters.type)

    const response = await apiClient.get(`/patients/${patientId}/timeline?${params.toString()}`)
    return response.data
  },
}

export default patientService 