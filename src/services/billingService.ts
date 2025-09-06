import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Create axios instance with auth headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface PatientBilling {
  id?: number
  patient_id: number
  current_balance: number
  insurance_paid: number
  patient_paid: number
  total_charges: number
  total_adjustments: number
  last_payment_date?: string
  last_payment_amount?: number
  payment_notes?: string
  created_at?: string
  updated_at?: string
}

export interface Invoice {
  id: number
  patient_id: number
  filename: string
  original_filename: string
  file_path: string
  mime_type: string
  file_size: number
  description?: string
  uploaded_by?: number
  status: string
  created_at: string
  updated_at: string
  document_type?: {
    id: number
    name: string
    code: string
    description?: string
    icon?: string
    color?: string
  }
}

export interface InvoiceLineItem {
  id?: number
  description: string
  quantity: number
  unit_price: number
  total_amount: number
  service_type?: string
  notes?: string
}

export interface BillingResponse {
  billing: PatientBilling
  invoices: Invoice[]
}

export const billingService = {
  // Get patient billing information
  async getPatientBilling(patientId: number): Promise<BillingResponse> {
    const response = await apiClient.get(`/patients/${patientId}/billing`)
    return response.data
  },

  // Update patient billing information
  async updatePatientBilling(patientId: number, billingData: Partial<PatientBilling>): Promise<PatientBilling> {
    const response = await apiClient.post(`/patients/${patientId}/billing`, billingData)
    return response.data.billing
  },

  // Create invoice
  async createInvoice(patientId: number, data: { notes?: string; line_items?: InvoiceLineItem[] }): Promise<Invoice> {
    const response = await apiClient.post(`/patients/${patientId}/billing/invoices/create`, data)
    return response.data.document
  },

  // Upload invoice
  async uploadInvoice(patientId: number, file: File, description?: string): Promise<Invoice> {
    const formData = new FormData()
    formData.append('file', file)
    if (description) {
      formData.append('description', description)
    }

    const response = await apiClient.post(`/patients/${patientId}/billing/invoices`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.document
  },

  // Download invoice
  async downloadInvoice(patientId: number, invoiceId: number): Promise<Blob> {
    const response = await apiClient.get(`/patients/${patientId}/billing/invoices/${invoiceId}/download`, {
      responseType: 'blob',
    })
    return response.data
  },

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  },

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}
