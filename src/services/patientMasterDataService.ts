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
export interface PatientAllergy {
  id: number
  patient_id: number
  master_allergy_id: number
  severity: 'mild' | 'moderate' | 'severe'
  reaction?: string
  onset_date?: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
  master_allergy: {
    id: number
    name: string
    description?: string
    severity: string
    category?: string
  }
}

export interface PatientMedicalProblem {
  id: number
  patient_id: number
  master_medical_problem_id: number
  severity: 'mild' | 'moderate' | 'severe'
  diagnosis_date?: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
  master_medical_problem: {
    id: number
    name: string
    description?: string
    icd_code?: string
    category?: string
    severity: string
  }
}

export interface PatientMedication {
  id: number
  patient_id: number
  master_medication_id: number
  medication_name: string
  dosage?: string
  frequency?: string
  route?: string
  start_date?: string
  end_date?: string
  status: 'active' | 'discontinued' | 'completed'
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
  master_medication: {
    id: number
    name: string
    description?: string
    generic_name?: string
    brand_name?: string
    dosage_form?: string
    strength?: string
    category?: string
    drug_class?: string
  }
}

export interface CreatePatientAllergyRequest {
  master_allergy_id: number
  severity: 'mild' | 'moderate' | 'severe'
  reaction?: string
  onset_date?: string
  notes?: string
}

export interface UpdatePatientAllergyRequest {
  severity: 'mild' | 'moderate' | 'severe'
  reaction?: string
  onset_date?: string
  notes?: string
}

export interface CreatePatientMedicalProblemRequest {
  master_medical_problem_id: number
  severity: 'mild' | 'moderate' | 'severe'
  diagnosis_date?: string
  notes?: string
}

export interface UpdatePatientMedicalProblemRequest {
  severity: 'mild' | 'moderate' | 'severe'
  diagnosis_date?: string
  notes?: string
}

export interface CreatePatientMedicationRequest {
  master_medication_id: number
  medication_name: string
  dosage?: string
  frequency?: string
  route?: string
  start_date?: string
  end_date?: string
  status: 'active' | 'discontinued' | 'completed'
  notes?: string
}

export interface UpdatePatientMedicationRequest {
  medication_name?: string
  dosage?: string
  frequency?: string
  route?: string
  start_date?: string
  end_date?: string
  status: 'active' | 'discontinued' | 'completed'
  notes?: string
}

// Patient Allergies
export const getPatientAllergies = async (patientId: number) => {
  const response = await apiClient.get(`/patients/${patientId}/allergies`)
  return response.data
}

export const createPatientAllergy = async (patientId: number, data: CreatePatientAllergyRequest) => {
  const response = await apiClient.post(`/patients/${patientId}/allergies`, data)
  return response.data
}

export const updatePatientAllergy = async (patientId: number, allergyId: number, data: UpdatePatientAllergyRequest) => {
  const response = await apiClient.put(`/patients/${patientId}/allergies/${allergyId}`, data)
  return response.data
}

export const deletePatientAllergy = async (patientId: number, allergyId: number) => {
  const response = await apiClient.delete(`/patients/${patientId}/allergies/${allergyId}`)
  return response.data
}

export const togglePatientAllergyStatus = async (patientId: number, allergyId: number) => {
  const response = await apiClient.patch(`/patients/${patientId}/allergies/${allergyId}/toggle-status`)
  return response.data
}

export const getAvailableAllergies = async (patientId: number) => {
  const response = await apiClient.get(`/patients/${patientId}/allergies/available`)
  return response.data
}

// Patient Medical Problems
export const getPatientMedicalProblems = async (patientId: number) => {
  const response = await apiClient.get(`/patients/${patientId}/medical-problems`)
  return response.data
}

export const createPatientMedicalProblem = async (patientId: number, data: CreatePatientMedicalProblemRequest) => {
  const response = await apiClient.post(`/patients/${patientId}/medical-problems`, data)
  return response.data
}

export const updatePatientMedicalProblem = async (patientId: number, problemId: number, data: UpdatePatientMedicalProblemRequest) => {
  const response = await apiClient.put(`/patients/${patientId}/medical-problems/${problemId}`, data)
  return response.data
}

export const deletePatientMedicalProblem = async (patientId: number, problemId: number) => {
  const response = await apiClient.delete(`/patients/${patientId}/medical-problems/${problemId}`)
  return response.data
}

export const togglePatientMedicalProblemStatus = async (patientId: number, problemId: number) => {
  const response = await apiClient.patch(`/patients/${patientId}/medical-problems/${problemId}/toggle-status`)
  return response.data
}

export const getAvailableMedicalProblems = async (patientId: number) => {
  const response = await apiClient.get(`/patients/${patientId}/medical-problems/available`)
  return response.data
}

// Patient Medications
export const getPatientMedications = async (patientId: number) => {
  const response = await apiClient.get(`/patients/${patientId}/medications`)
  return response.data
}

export const createPatientMedication = async (patientId: number, data: CreatePatientMedicationRequest) => {
  const response = await apiClient.post(`/patients/${patientId}/medications`, data)
  return response.data
}

export const updatePatientMedication = async (patientId: number, medicationId: number, data: UpdatePatientMedicationRequest) => {
  const response = await apiClient.put(`/patients/${patientId}/medications/${medicationId}`, data)
  return response.data
}

export const deletePatientMedication = async (patientId: number, medicationId: number) => {
  const response = await apiClient.delete(`/patients/${patientId}/medications/${medicationId}`)
  return response.data
}

export const togglePatientMedicationStatus = async (patientId: number, medicationId: number) => {
  const response = await apiClient.patch(`/patients/${patientId}/medications/${medicationId}/toggle-status`)
  return response.data
}

export const getAvailableMedications = async (patientId: number) => {
  const response = await apiClient.get(`/patients/${patientId}/medications/available`)
  return response.data
}

export default {
  // Allergies
  getPatientAllergies,
  createPatientAllergy,
  updatePatientAllergy,
  deletePatientAllergy,
  togglePatientAllergyStatus,
  getAvailableAllergies,
  
  // Medical Problems
  getPatientMedicalProblems,
  createPatientMedicalProblem,
  updatePatientMedicalProblem,
  deletePatientMedicalProblem,
  togglePatientMedicalProblemStatus,
  getAvailableMedicalProblems,
  
  // Medications
  getPatientMedications,
  createPatientMedication,
  updatePatientMedication,
  deletePatientMedication,
  togglePatientMedicationStatus,
  getAvailableMedications,
}
