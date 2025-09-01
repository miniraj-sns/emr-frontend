import axios from 'axios'

// API client setup
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface VitalSigns {
  id: number
  patient_id: number
  recorded_by: number
  height: string | null
  weight: string | null
  blood_pressure_systolic: number | null
  blood_pressure_diastolic: number | null
  temperature: number | null
  heart_rate: number | null
  oxygen_saturation: number | null
  respiratory_rate: number | null
  recorded_at: string
  notes: string | null
  created_at: string
  updated_at: string
  recordedBy?: {
    id: number
    first_name: string
    last_name: string
  }
}

export interface CreateVitalSignsRequest {
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
}

export interface UpdateVitalSignsRequest extends CreateVitalSignsRequest {
  id: number
}

// Get patient vital signs
export const getPatientVitalSigns = async (patientId: number) => {
  const response = await apiClient.get(`/patients/${patientId}/vital-signs`)
  return response.data
}

// Create new vital signs
export const createVitalSigns = async (patientId: number, data: CreateVitalSignsRequest) => {
  const response = await apiClient.post(`/patients/${patientId}/vital-signs`, data)
  return response.data
}

// Update vital signs
export const updateVitalSigns = async (patientId: number, vitalSignsId: number, data: UpdateVitalSignsRequest) => {
  const response = await apiClient.put(`/patients/${patientId}/vital-signs/${vitalSignsId}`, data)
  return response.data
}

// Delete vital signs
export const deleteVitalSigns = async (patientId: number, vitalSignsId: number) => {
  const response = await apiClient.delete(`/patients/${patientId}/vital-signs/${vitalSignsId}`)
  return response.data
}

// Get specific vital signs record
export const getVitalSignsById = async (patientId: number, vitalSignsId: number) => {
  const response = await apiClient.get(`/patients/${patientId}/vital-signs/${vitalSignsId}`)
  return response.data
}

const vitalSignsService = {
  getPatientVitalSigns,
  createVitalSigns,
  updateVitalSigns,
  deleteVitalSigns,
  getVitalSignsById
}

export default vitalSignsService
