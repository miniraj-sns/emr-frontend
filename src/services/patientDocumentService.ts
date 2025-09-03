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

// User interface for uploaded_by field
export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  email_verified_at?: string
  phone?: string
  pay_rate?: number
  avatar?: string
  bio?: string
  settings?: any
  is_active: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

// Patient Document Types
export interface PatientDocument {
  id: number
  patient_id: number
  document_type_id: number
  filename: string
  original_filename: string
  file_path: string
  mime_type: string
  file_size: number
  description?: string
  uploaded_by?: string | User
  status: 'active' | 'archived' | 'deleted'
  uploaded_at: string
  created_at: string
  updated_at: string
  document_type?: DocumentType
  uploadedBy?: User
  file_size_formatted?: string
  file_icon?: string
}

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

export interface DocumentCategory {
  id: number
  name: string
  code: string
  icon: string
  color: string
  description?: string
  count: number
}

export interface CreateDocumentRequest {
  file: File
  document_type_id: number
  description?: string
}

export interface UpdateDocumentRequest {
  document_type_id?: number
  description?: string
}

export interface DocumentsResponse {
  documents: PatientDocument[]
  categories: DocumentCategory[]
}

// Patient Document API Methods
export const getPatientDocuments = async (patientId: number, params?: { type?: string }): Promise<DocumentsResponse> => {
  const response = await apiClient.get(`/patients/${patientId}/documents`, { params })
  return response.data
}

export const uploadDocument = async (patientId: number, data: CreateDocumentRequest): Promise<PatientDocument> => {
  const formData = new FormData()
  formData.append('file', data.file)
  formData.append('document_type_id', data.document_type_id.toString())
  if (data.description) {
    formData.append('description', data.description)
  }

  const response = await apiClient.post(`/patients/${patientId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const updateDocument = async (patientId: number, documentId: number, data: UpdateDocumentRequest): Promise<PatientDocument> => {
  const response = await apiClient.put(`/patients/${patientId}/documents/${documentId}`, data)
  return response.data
}

export const deleteDocument = async (patientId: number, documentId: number): Promise<void> => {
  await apiClient.delete(`/patients/${patientId}/documents/${documentId}`)
}

export const downloadDocument = async (patientId: number, documentId: number): Promise<Blob> => {
  const response = await apiClient.get(`/patients/${patientId}/documents/${documentId}/download`, {
    responseType: 'blob'
  })
  return response.data
}

export const getDocumentContent = async (patientId: number, documentId: number): Promise<string> => {
  const response = await apiClient.get(`/patients/${patientId}/documents/${documentId}/content`)
  return response.data.content
}

// Utility functions
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return 'image'
  } else if (mimeType === 'application/pdf') {
    return 'file-text'
  } else if (mimeType.startsWith('text/')) {
    return 'file-text'
  } else if (mimeType.includes('word') || mimeType.includes('document')) {
    return 'file-text'
  } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
    return 'file-text'
  } else if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
    return 'file-text'
  } else {
    return 'file'
  }
}
