import axios from 'axios'

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

export interface MasterDataItem {
  id: number
  name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MasterAllergy extends MasterDataItem {
  severity: 'mild' | 'moderate' | 'severe'
  category?: string
}

export interface MasterMedicalProblem extends MasterDataItem {
  icd_code?: string
  category?: string
  severity: 'mild' | 'moderate' | 'severe'
}

export interface MasterMedication extends MasterDataItem {
  generic_name?: string
  brand_name?: string
  dosage_form?: string
  strength?: string
  category?: string
  drug_class?: string
  indications?: string
  contraindications?: string
  side_effects?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

class MasterDataService {
  // Allergies
  async getAllergies(params?: {
    search?: string
    category?: string
    severity?: string
    is_active?: boolean
    sort_by?: string
    sort_order?: 'asc' | 'desc'
    per_page?: number
    page?: number
  }): Promise<PaginatedResponse<MasterAllergy>> {
    const response = await apiClient.get('/master-data/allergies', { params })
    return response.data
  }

  async createAllergy(data: Omit<MasterAllergy, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: MasterAllergy }> {
    const response = await apiClient.post('/master-data/allergies', data)
    return response.data
  }

  async updateAllergy(id: number, data: Partial<MasterAllergy>): Promise<{ success: boolean; data: MasterAllergy }> {
    const response = await apiClient.put(`/master-data/allergies/${id}`, data)
    return response.data
  }

  async deleteAllergy(id: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/master-data/allergies/${id}`)
    return response.data
  }

  async toggleAllergyStatus(id: number): Promise<{ success: boolean; data: MasterAllergy }> {
    const response = await apiClient.patch(`/master-data/allergies/${id}/toggle-status`)
    return response.data
  }

  async getAllergyCategories(): Promise<{ success: boolean; data: string[] }> {
    const response = await apiClient.get('/master-data/allergies/categories')
    return response.data
  }

  async getAllergySeverities(): Promise<{ success: boolean; data: string[] }> {
    const response = await apiClient.get('/master-data/allergies/severities')
    return response.data
  }

  // Medical Problems
  async getMedicalProblems(params?: {
    search?: string
    category?: string
    severity?: string
    icd_code?: string
    is_active?: boolean
    sort_by?: string
    sort_order?: 'asc' | 'desc'
    per_page?: number
    page?: number
  }): Promise<PaginatedResponse<MasterMedicalProblem>> {
    const response = await apiClient.get('/master-data/medical-problems', { params })
    return response.data
  }

  async createMedicalProblem(data: Omit<MasterMedicalProblem, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: MasterMedicalProblem }> {
    const response = await apiClient.post('/master-data/medical-problems', data)
    return response.data
  }

  async updateMedicalProblem(id: number, data: Partial<MasterMedicalProblem>): Promise<{ success: boolean; data: MasterMedicalProblem }> {
    const response = await apiClient.put(`/master-data/medical-problems/${id}`, data)
    return response.data
  }

  async deleteMedicalProblem(id: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/master-data/medical-problems/${id}`)
    return response.data
  }

  async toggleMedicalProblemStatus(id: number): Promise<{ success: boolean; data: MasterMedicalProblem }> {
    const response = await apiClient.patch(`/master-data/medical-problems/${id}/toggle-status`)
    return response.data
  }

  async getMedicalProblemCategories(): Promise<{ success: boolean; data: string[] }> {
    const response = await apiClient.get('/master-data/medical-problems/categories')
    return response.data
  }

  async getMedicalProblemSeverities(): Promise<{ success: boolean; data: string[] }> {
    const response = await apiClient.get('/master-data/medical-problems/severities')
    return response.data
  }

  // Medications
  async getMedications(params?: {
    search?: string
    category?: string
    drug_class?: string
    dosage_form?: string
    is_active?: boolean
    sort_by?: string
    sort_order?: 'asc' | 'desc'
    per_page?: number
    page?: number
  }): Promise<PaginatedResponse<MasterMedication>> {
    const response = await apiClient.get('/master-data/medications', { params })
    return response.data
  }

  async createMedication(data: Omit<MasterMedication, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: MasterMedication }> {
    const response = await apiClient.post('/master-data/medications', data)
    return response.data
  }

  async updateMedication(id: number, data: Partial<MasterMedication>): Promise<{ success: boolean; data: MasterMedication }> {
    const response = await apiClient.put(`/master-data/medications/${id}`, data)
    return response.data
  }

  async deleteMedication(id: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/master-data/medications/${id}`)
    return response.data
  }

  async toggleMedicationStatus(id: number): Promise<{ success: boolean; data: MasterMedication }> {
    const response = await apiClient.patch(`/master-data/medications/${id}/toggle-status`)
    return response.data
  }

  async getMedicationCategories(): Promise<{ success: boolean; data: string[] }> {
    const response = await apiClient.get('/master-data/medications/categories')
    return response.data
  }

  async getMedicationDrugClasses(): Promise<{ success: boolean; data: string[] }> {
    const response = await apiClient.get('/master-data/medications/drug-classes')
    return response.data
  }

  async getMedicationDosageForms(): Promise<{ success: boolean; data: string[] }> {
    const response = await apiClient.get('/master-data/medications/dosage-forms')
    return response.data
  }
}

export default new MasterDataService()
