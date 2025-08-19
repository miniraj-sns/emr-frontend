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
  PatientReport
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
  const token = localStorage.getItem('user_token')
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
}

export default patientService 