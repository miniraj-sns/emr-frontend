import axios from 'axios'
import { 
  FormTemplate, 
  FormSubmission, 
  PatientFormsResponse, 
  FormFilters,
  CreateFormSubmissionRequest,
  UpdateFormSubmissionRequest
} from '../types/form'

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

export const formService = {
  // Get all form templates
  async getFormTemplates(): Promise<FormTemplate[]> {
    const response = await apiClient.get('/forms/templates?per_page=100')
    // Handle paginated response from backend
    return response.data.templates || response.data || []
  },

  // Get single form template
  async getFormTemplate(id: number): Promise<FormTemplate> {
    const response = await apiClient.get(`/forms/templates/${id}`)
    return response.data
  },

  // Create form template
  async createFormTemplate(templateData: Partial<FormTemplate>): Promise<FormTemplate> {
    const response = await apiClient.post('/forms/templates', templateData)
    return response.data
  },

  // Update form template
  async updateFormTemplate(id: number, templateData: Partial<FormTemplate>): Promise<FormTemplate> {
    const response = await apiClient.put(`/forms/templates/${id}`, templateData)
    return response.data
  },

  // Delete form template
  async deleteFormTemplate(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/forms/templates/${id}`)
    return response.data
  },

  // Get patient forms
  async getPatientForms(patientId: number, filters?: FormFilters): Promise<PatientFormsResponse> {
    const params = new URLSearchParams()
    
    if (filters?.template_id) params.append('template_id', filters.template_id.toString())
    if (filters?.status) params.append('status', filters.status)
    if (filters?.date_from) params.append('date_from', filters.date_from)
    if (filters?.date_to) params.append('date_to', filters.date_to)

    const response = await apiClient.get(`/patients/${patientId}/forms?${params.toString()}`)
    return response.data
  },

  // Get single form submission
  async getFormSubmission(submissionId: number): Promise<FormSubmission> {
    const response = await apiClient.get(`/forms/submissions/${submissionId}`)
    return response.data
  },

  // Create form submission
  async createFormSubmission(patientId: number, submissionData: CreateFormSubmissionRequest): Promise<FormSubmission> {
    const response = await apiClient.post(`/patients/${patientId}/forms/${submissionData.form_template_id}/submit`, submissionData)
    return response.data
  },

  // Update form submission
  async updateFormSubmission(submissionId: number, submissionData: UpdateFormSubmissionRequest): Promise<FormSubmission> {
    const response = await apiClient.put(`/forms/submissions/${submissionId}`, submissionData)
    return response.data
  },

  // Get all form submissions (for admin/overview)
  async getFormSubmissions(filters?: {
    patient_id?: number
    template_id?: number
    status?: string
  }): Promise<FormSubmission[]> {
    const params = new URLSearchParams()
    
    if (filters?.patient_id) params.append('patient_id', filters.patient_id.toString())
    if (filters?.template_id) params.append('template_id', filters.template_id.toString())
    if (filters?.status) params.append('status', filters.status)

    const response = await apiClient.get(`/forms/submissions?${params.toString()}`)
    return response.data
  }
}

export default formService
