export interface FormTemplate {
  id: number
  name: string
  key: string
  description?: string
  fields: FormField[]
  is_active: boolean
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface FormField {
  id: string
  type: 'text' | 'textarea' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'checkbox' | 'radio' | 'file'
  label: string
  required?: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
  metadata?: Record<string, any>
}

export interface FormSubmission {
  id: number
  form_template_id: number
  patient_id: number
  submitted_by_user_id: number
  data: Record<string, any>
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  form_template?: FormTemplate
  patient?: {
    id: number
    first_name: string
    last_name: string
  }
  submitted_by?: {
    id: number
    first_name: string
    last_name: string
  }
}

export interface PatientFormsResponse {
  patient_id: number
  patient_name: string
  forms: FormSubmission[]
  available_templates: FormTemplate[]
  total_forms: number
  statistics: {
    draft: number
    submitted: number
    approved: number
    rejected: number
  }
}

export interface FormFilters {
  template_id?: number
  status?: 'draft' | 'submitted' | 'approved' | 'rejected'
  date_from?: string
  date_to?: string
}

export interface CreateFormSubmissionRequest {
  form_template_id: number
  data: Record<string, any>
  status?: 'draft' | 'submitted'
}

export interface UpdateFormSubmissionRequest {
  data?: Record<string, any>
  status?: 'draft' | 'submitted' | 'approved' | 'rejected'
}
