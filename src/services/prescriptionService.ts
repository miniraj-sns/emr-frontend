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

// Types
export interface Prescription {
  id: number
  patient_id: number
  prescribed_by_user_id: number
  starting_date: string
  drug_name: string
  drug_type: 'default' | 'rxnorm' | 'rxcui'
  quantity: number
  size?: string
  unit_id?: number
  directions?: string
  route_id?: number
  interval_id?: number
  refills: number
  refill_quantity: number
  notes?: string
  substitution: 'substitution allowed' | 'no substitution'
  is_active: boolean
  created_at: string
  updated_at: string
  unit?: {
    id: number
    name: string
    code: string
  }
  route?: {
    id: number
    name: string
    code: string
  }
  interval?: {
    id: number
    name: string
    code: string
  }
}

export interface CreatePrescriptionRequest {
  starting_date: string
  drug_name: string
  drug_type: 'default' | 'rxnorm' | 'rxcui'
  quantity: number
  size?: string
  unit_id?: number
  directions?: string
  route_id?: number
  interval_id?: number
  refills?: number
  refill_quantity?: number
  notes?: string
  substitution: 'substitution allowed' | 'no substitution'
}

export interface UpdatePrescriptionRequest {
  starting_date: string
  drug_name: string
  drug_type: 'default' | 'rxnorm' | 'rxcui'
  quantity: number
  size?: string
  unit_id?: number
  directions?: string
  route_id?: number
  interval_id?: number
  refills?: number
  refill_quantity?: number
  notes?: string
  substitution: 'substitution allowed' | 'no substitution'
}

export interface MasterUnit {
  id: number
  name: string
  code: string
  description?: string
  is_active: boolean
}

export interface MasterRoute {
  id: number
  name: string
  code: string
  description?: string
  is_active: boolean
}

export interface MasterInterval {
  id: number
  name: string
  code: string
  description?: string
  is_active: boolean
}

// Prescription API functions
export const getPatientPrescriptions = async (patientId: number) => {
  const response = await apiClient.get(`/patients/${patientId}/prescriptions`)
  return response.data
}

export const createPrescription = async (patientId: number, data: CreatePrescriptionRequest) => {
  const response = await apiClient.post(`/patients/${patientId}/prescriptions`, data)
  return response.data
}

export const updatePrescription = async (patientId: number, prescriptionId: number, data: UpdatePrescriptionRequest) => {
  const response = await apiClient.put(`/patients/${patientId}/prescriptions/${prescriptionId}`, data)
  return response.data
}

export const deletePrescription = async (patientId: number, prescriptionId: number) => {
  const response = await apiClient.delete(`/patients/${patientId}/prescriptions/${prescriptionId}`)
  return response.data
}

export const togglePrescriptionStatus = async (patientId: number, prescriptionId: number) => {
  const response = await apiClient.patch(`/patients/${patientId}/prescriptions/${prescriptionId}/toggle-status`)
  return response.data
}

// Master Data API functions
export const getMasterUnits = async () => {
  const response = await apiClient.get('/master-data/units')
  return response.data
}

export const createMasterUnit = async (data: { name: string; code: string; description?: string; is_active?: boolean }) => {
  const response = await apiClient.post('/master-data/units', data)
  return response.data
}

export const updateMasterUnit = async (id: number, data: { name: string; code: string; description?: string }) => {
  const response = await apiClient.put(`/master-data/units/${id}`, data)
  return response.data
}

export const deleteMasterUnit = async (id: number) => {
  const response = await apiClient.delete(`/master-data/units/${id}`)
  return response.data
}

export const toggleMasterUnitStatus = async (id: number) => {
  const response = await apiClient.patch(`/master-data/units/${id}/toggle-status`)
  return response.data
}

export const getMasterRoutes = async () => {
  const response = await apiClient.get('/master-data/routes')
  return response.data
}

export const createMasterRoute = async (data: { name: string; code: string; description?: string; is_active?: boolean }) => {
  const response = await apiClient.post('/master-data/routes', data)
  return response.data
}

export const updateMasterRoute = async (id: number, data: { name: string; code: string; description?: string }) => {
  const response = await apiClient.put(`/master-data/routes/${id}`, data)
  return response.data
}

export const deleteMasterRoute = async (id: number) => {
  const response = await apiClient.delete(`/master-data/routes/${id}`)
  return response.data
}

export const toggleMasterRouteStatus = async (id: number) => {
  const response = await apiClient.patch(`/master-data/routes/${id}/toggle-status`)
  return response.data
}

export const getMasterIntervals = async () => {
  const response = await apiClient.get('/master-data/intervals')
  return response.data
}

export const createMasterInterval = async (data: { name: string; code: string; description?: string; is_active?: boolean }) => {
  const response = await apiClient.post('/master-data/intervals', data)
  return response.data
}

export const updateMasterInterval = async (id: number, data: { name: string; code: string; description?: string }) => {
  const response = await apiClient.put(`/master-data/intervals/${id}`, data)
  return response.data
}

export const deleteMasterInterval = async (id: number) => {
  const response = await apiClient.delete(`/master-data/intervals/${id}`)
  return response.data
}

export const toggleMasterIntervalStatus = async (id: number) => {
  const response = await apiClient.patch(`/master-data/intervals/${id}/toggle-status`)
  return response.data
}

export default {
  // Prescriptions
  getPatientPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
  togglePrescriptionStatus,
  
  // Master Data
  getMasterUnits,
  createMasterUnit,
  updateMasterUnit,
  deleteMasterUnit,
  toggleMasterUnitStatus,
  getMasterRoutes,
  createMasterRoute,
  updateMasterRoute,
  deleteMasterRoute,
  toggleMasterRouteStatus,
  getMasterIntervals,
  createMasterInterval,
  updateMasterInterval,
  deleteMasterInterval,
  toggleMasterIntervalStatus,
}
