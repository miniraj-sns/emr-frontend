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

// Insurance Company Types
export interface InsuranceCompany {
  id: number
  name: string
  code: string
  phone?: string
  email?: string
  address?: string
  website?: string
  contact_person?: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateInsuranceCompanyRequest {
  name: string
  code: string
  phone?: string
  email?: string
  address?: string
  website?: string
  contact_person?: string
  notes?: string
  is_active?: boolean
}

export interface UpdateInsuranceCompanyRequest extends CreateInsuranceCompanyRequest {
  id: number
}

// Patient Insurance Types
export interface PatientInsurance {
  id: number
  patient_id: number
  insurance_company_id: number
  type: 'primary' | 'secondary'
  policy_number: string
  group_number?: string
  subscriber_name: string
  subscriber_relationship?: string
  effective_date: string
  expiration_date?: string
  copay_amount?: number
  deductible_amount?: number
  coinsurance_percentage?: number
  out_of_pocket_maximum?: number
  status: 'active' | 'inactive' | 'expired' | 'pending'
  notes?: string
  created_at: string
  updated_at: string
  insurance_company?: InsuranceCompany
}

export interface CreatePatientInsuranceRequest {
  insurance_company_id: number
  type: 'primary' | 'secondary'
  policy_number: string
  group_number?: string
  subscriber_name: string
  subscriber_relationship?: string
  effective_date: string
  expiration_date?: string
  copay_amount?: number
  deductible_amount?: number
  coinsurance_percentage?: number
  out_of_pocket_maximum?: number
  status?: 'active' | 'inactive' | 'expired' | 'pending'
  notes?: string
}

export interface UpdatePatientInsuranceRequest extends CreatePatientInsuranceRequest {
  id: number
}

// Patient Billing Types
export interface PatientBilling {
  id: number
  patient_id: number
  current_balance: number
  insurance_paid: number
  patient_paid: number
  total_charges: number
  total_adjustments: number
  last_payment_date?: string
  last_payment_amount?: number
  payment_notes?: string
  created_at: string
  updated_at: string
}

// Insurance Company API Methods
export const getInsuranceCompanies = async (params?: { search?: string; active?: boolean }) => {
  const response = await apiClient.get('/master-data/insurance-companies', { params })
  return response.data
}

export const createInsuranceCompany = async (data: CreateInsuranceCompanyRequest) => {
  const response = await apiClient.post('/master-data/insurance-companies', data)
  return response.data
}

export const updateInsuranceCompany = async (id: number, data: UpdateInsuranceCompanyRequest) => {
  const response = await apiClient.put(`/master-data/insurance-companies/${id}`, data)
  return response.data
}

export const deleteInsuranceCompany = async (id: number) => {
  const response = await apiClient.delete(`/master-data/insurance-companies/${id}`)
  return response.data
}

// Patient Insurance API Methods
export const getPatientInsurances = async (patientId: number) => {
  const response = await apiClient.get(`/patients/${patientId}/insurances`)
  return response.data
}

export const createPatientInsurance = async (patientId: number, data: CreatePatientInsuranceRequest) => {
  const response = await apiClient.post(`/patients/${patientId}/insurances`, data)
  return response.data
}

export const updatePatientInsurance = async (patientId: number, insuranceId: number, data: UpdatePatientInsuranceRequest) => {
  const response = await apiClient.put(`/patients/${patientId}/insurances/${insuranceId}`, data)
  return response.data
}

export const deletePatientInsurance = async (patientId: number, insuranceId: number) => {
  const response = await apiClient.delete(`/patients/${patientId}/insurances/${insuranceId}`)
  return response.data
}

const insuranceService = {
  // Insurance Companies
  getInsuranceCompanies,
  createInsuranceCompany,
  updateInsuranceCompany,
  deleteInsuranceCompany,
  
  // Patient Insurance
  getPatientInsurances,
  createPatientInsurance,
  updatePatientInsurance,
  deletePatientInsurance,
}

export default insuranceService


