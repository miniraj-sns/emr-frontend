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

// Document Type Types
export interface DocumentType {
  id: number
  name: string
  code: string
  description?: string
  icon: string
  color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateDocumentTypeRequest {
  name: string
  code: string
  description?: string
  icon?: string
  color?: string
  is_active?: boolean
}

export interface UpdateDocumentTypeRequest extends CreateDocumentTypeRequest {
  id: number
}

// Document Type API Methods
export const getDocumentTypes = async (params?: { search?: string; active?: boolean }) => {
  const response = await apiClient.get('/master-data/document-types', { params })
  return response.data
}

export const createDocumentType = async (data: CreateDocumentTypeRequest) => {
  const response = await apiClient.post('/master-data/document-types', data)
  return response.data
}

export const updateDocumentType = async (id: number, data: UpdateDocumentTypeRequest) => {
  const response = await apiClient.put(`/master-data/document-types/${id}`, data)
  return response.data
}

export const deleteDocumentType = async (id: number) => {
  const response = await apiClient.delete(`/master-data/document-types/${id}`)
  return response.data
}
