import axios from 'axios'
import { Lead } from '../features/crm/crmSlice'

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

// CRM Types - Aligned with backend models
export interface Contact {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  company?: string
  position?: string
  status: 'active' | 'inactive' | 'prospect'
  source: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Opportunity {
  id: number
  name: string
  lead_id: number | null
  amount: number
  pipeline_id: number | null
  stage: string
  owner_user_id: number | null
  status: string
  probability: number
  expected_close_date: string | null
  notes: string | null
  metadata: any
  created_at: string
  updated_at: string
  // Computed properties for display
  lead?: {
    id: number
    name: string
  }
}

export interface FollowUp {
  id: number
  contact_id: number
  contact_name: string
  type: 'call' | 'email' | 'meeting' | 'note'
  subject: string
  description: string
  scheduled_date: string
  completed: boolean
  completed_date?: string
  created_at: string
  updated_at: string
}

export interface CRMFilters {
  search?: string
  status?: string
  source?: string
  stage?: string
  type?: string
  page?: number
  per_page?: number
}

export interface CRMStatistics {
  total_leads: number
  total_contacts: number
  total_opportunities: number
  total_value: number
  conversion_rate: number
  this_month_leads: number
  this_month_opportunities: number
}

export const crmService = {
  // Lead Management
  async getLeads(filters: CRMFilters = {}): Promise<{ data: Lead[]; total: number }> {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.source) params.append('source', filters.source)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const response = await apiClient.get(`/crm/leads?${params.toString()}`)
    const responseData = response.data as any
    return {
      data: responseData.leads || responseData,
      total: responseData.pagination?.total || responseData.length
    }
  },

  async getLead(id: number): Promise<Lead> {
    const response = await apiClient.get(`/crm/leads/${id}`)
    return response.data
  },

  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    const response = await apiClient.post('/crm/leads', leadData)
    return response.data
  },

  async updateLead(id: number, leadData: Partial<Lead>): Promise<Lead> {
    const response = await apiClient.put(`/crm/leads/${id}`, leadData)
    return response.data
  },

  async deleteLead(id: number): Promise<void> {
    await apiClient.delete(`/crm/leads/${id}`)
  },

  // Lead Conversion Methods
  async convertLeadToContact(id: number, data: { stage?: string, notes?: string }): Promise<{ message: string, lead: Lead }> {
    const response = await apiClient.post(`/crm/leads/${id}/convert-to-contact`, data)
    return response.data as { message: string, lead: Lead }
  },

  async convertLeadToOpportunity(id: number, data: {
    amount: number,
    stage?: string,
    probability?: number,
    expected_close_date?: string,
    notes?: string
  }): Promise<{ message: string, opportunity: Opportunity, lead: Lead }> {
    const response = await apiClient.post(`/crm/leads/${id}/convert-to-opportunity`, data)
    return response.data as { message: string, opportunity: Opportunity, lead: Lead }
  },

  async convertLeadToPatient(id: number, data: { stage?: string, notes?: string }): Promise<{ message: string, patient: any, lead: Lead }> {
    const response = await apiClient.post(`/crm/leads/${id}/convert-to-patient`, data)
    return response.data as { message: string, patient: any, lead: Lead }
  },

  // Convert lead to patient
  async convertLeadToPatient(leadId: number, data: { stage: string; notes?: string }): Promise<any> {
    const response = await apiClient.post(`/crm/leads/${leadId}/convert-to-patient`, data)
    return response.data
  },

  // Create patient directly from lead (NEW)
  async createPatientFromLead(leadId: number, data: { notes?: string }): Promise<any> {
    const response = await apiClient.post(`/crm/leads/${leadId}/create-patient`, data)
    return response.data
  },

  // Convert contact to patient
  async convertContactToPatient(contactId: number, data: { notes?: string }): Promise<any> {
    const response = await apiClient.post(`/crm/contacts/${contactId}/convert-to-patient`, data)
    return response.data
  },

  // Get lead conversion options
  async getLeadConversionOptions(id: number): Promise<{
    can_convert_to_contact: boolean,
    can_convert_to_opportunity: boolean,
    can_convert_to_patient: boolean,
    current_stage: string,
    current_status: string,
    stages: Record<string, string>
  }> {
    const response = await apiClient.get(`/crm/leads/${id}/conversion-options`)
    return response.data as {
      can_convert_to_contact: boolean,
      can_convert_to_opportunity: boolean,
      can_convert_to_patient: boolean,
      current_stage: string,
      current_status: string,
      stages: Record<string, string>
    }
  },

  // Contact Management - Note: Backend doesn't have contacts, using leads instead
  async getContacts(filters: CRMFilters = {}): Promise<{ data: Contact[]; total: number }> {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.source) params.append('source', filters.source)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const response = await apiClient.get(`/crm/contacts?${params.toString()}`)
    const responseData = response.data as any
    
    // Transform lead data to contact format
    const contacts: Contact[] = (responseData.contacts || []).map((lead: any) => ({
      id: lead.id,
      first_name: lead.name.split(' ')[0] || '',
      last_name: lead.name.split(' ').slice(1).join(' ') || '',
      email: lead.email,
      phone: lead.phone,
      status: lead.status as any,
      source: lead.source,
      notes: lead.notes,
      created_at: lead.created_at,
      updated_at: lead.updated_at
    }))
    
    return {
      data: contacts,
      total: responseData.pagination?.total || contacts.length
    }
  },

  async getContact(id: number): Promise<Contact> {
    const lead = await this.getLead(id)
    return {
      id: lead.id,
      first_name: lead.name.split(' ')[0] || '',
      last_name: lead.name.split(' ').slice(1).join(' ') || '',
      email: lead.email,
      phone: lead.phone,
      status: lead.status as any,
      source: lead.source,
      notes: lead.notes,
      created_at: lead.created_at,
      updated_at: lead.updated_at
    }
  },

  async createContact(contactData: Partial<Contact>): Promise<Contact> {
    const leadData = {
      name: `${contactData.first_name} ${contactData.last_name}`.trim(),
      email: contactData.email,
      phone: contactData.phone,
      source: contactData.source,
      status: contactData.status,
      notes: contactData.notes
    }
    const lead = await this.createLead(leadData)
    return this.getContact(lead.id)
  },

  async updateContact(id: number, contactData: Partial<Contact>): Promise<Contact> {
    const leadData = {
      name: `${contactData.first_name} ${contactData.last_name}`.trim(),
      email: contactData.email,
      phone: contactData.phone,
      source: contactData.source,
      status: contactData.status,
      notes: contactData.notes
    }
    const lead = await this.updateLead(id, leadData)
    return this.getContact(lead.id)
  },

  async deleteContact(id: number): Promise<void> {
    await this.deleteLead(id)
  },

  // Opportunity Management
  async getOpportunities(filters: CRMFilters = {}): Promise<{ data: Opportunity[]; total: number }> {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.stage) params.append('stage', filters.stage)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const response = await apiClient.get(`/crm/opportunities?${params.toString()}`)
    return {
      data: response.data.opportunities || response.data.data || [],
      total: response.data.pagination?.total || response.data.total || 0
    }
  },

  async getOpportunity(id: number): Promise<Opportunity> {
    const response = await apiClient.get(`/crm/opportunities/${id}`)
    return response.data
  },

  async createOpportunity(opportunityData: Partial<Opportunity>): Promise<Opportunity> {
    const response = await apiClient.post('/crm/opportunities', opportunityData)
    return response.data
  },

  async updateOpportunity(id: number, opportunityData: Partial<Opportunity>): Promise<Opportunity> {
    const response = await apiClient.put(`/crm/opportunities/${id}`, opportunityData)
    return response.data
  },

  async deleteOpportunity(id: number): Promise<void> {
    await apiClient.delete(`/crm/opportunities/${id}`)
  },

  // Follow-up Management - Using tasks as follow-ups
  async getFollowUps(filters: CRMFilters = {}): Promise<{ data: FollowUp[]; total: number }> {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.type) params.append('type', filters.type)
    if (filters.status) params.append('status', filters.status)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())

    const response = await apiClient.get(`/crm/tasks?${params.toString()}`)
    const followUps: FollowUp[] = (response.data.tasks || response.data.data || []).map((task: any) => ({
      id: task.id,
      contact_id: task.subject_id || 0,
      contact_name: task.subject?.name || 'Unknown',
      type: task.type || 'note',
      subject: task.title || task.subject || '',
      description: task.description || '',
      scheduled_date: task.due_date || task.created_at,
      completed: task.completed || false,
      completed_date: task.completed_at,
      created_at: task.created_at,
      updated_at: task.updated_at
    }))
    return {
      data: followUps,
      total: response.data.pagination?.total || response.data.total || 0
    }
  },

  async getFollowUp(id: number): Promise<FollowUp> {
    const response = await apiClient.get(`/crm/tasks/${id}`)
    const task = response.data
    return {
      id: task.id,
      contact_id: task.subject_id || 0,
      contact_name: task.subject?.name || 'Unknown',
      type: task.type || 'note',
      subject: task.title || task.subject || '',
      description: task.description || '',
      scheduled_date: task.due_date || task.created_at,
      completed: task.completed || false,
      completed_date: task.completed_at,
      created_at: task.created_at,
      updated_at: task.updated_at
    }
  },

  async createFollowUp(followUpData: Partial<FollowUp> & { entityType?: 'lead' | 'contact' | 'opportunity' }): Promise<FollowUp> {
    const subjectType = followUpData.entityType === 'opportunity'
      ? 'App\\Models\\CrmOpportunity'
      : 'App\\Models\\CrmLead'

    const taskData = {
      title: followUpData.subject,
      description: followUpData.description,
      type: followUpData.type,
      due_at: followUpData.scheduled_date,
      subject_type: subjectType,
      subject_id: followUpData.contact_id
    }
    const response = await apiClient.post('/crm/tasks', taskData)
    return this.getFollowUp(response.data.id)
  },

  async updateFollowUp(id: number, followUpData: Partial<FollowUp>): Promise<FollowUp> {
    const taskData = {
      title: followUpData.subject,
      description: followUpData.description,
      type: followUpData.type,
      due_at: followUpData.scheduled_date,
      completed: followUpData.completed
    }
    const response = await apiClient.put(`/crm/tasks/${id}`, taskData)
    return this.getFollowUp(response.data.id)
  },

  async deleteFollowUp(id: number): Promise<void> {
    await apiClient.delete(`/crm/tasks/${id}`)
  },

  async completeFollowUp(id: number): Promise<void> {
    await apiClient.patch(`/crm/tasks/${id}/complete`)
  },

  // CRM Statistics - Mock data since backend doesn't have this endpoint
  async getStatistics(): Promise<CRMStatistics> {
    try {
    const response = await apiClient.get('/crm/statistics')
    return response.data
    } catch (error) {
      // Return mock data if endpoint doesn't exist
      const leadsResponse = await this.getLeads({ per_page: 1 })
      const opportunitiesResponse = await this.getOpportunities({ per_page: 1 })
      
      return {
        total_leads: leadsResponse.total,
        total_contacts: leadsResponse.total, // Using leads as contacts
        total_opportunities: opportunitiesResponse.total,
        total_value: 0, // Would need to calculate from opportunities
        conversion_rate: 0,
        this_month_leads: 0,
        this_month_opportunities: 0
      }
    }
  },

  // Convert Lead to Contact
  async convertLead(leadId: number, contactData: Partial<Contact>): Promise<Contact> {
    const response = await apiClient.post(`/crm/leads/${leadId}/convert`, contactData)
    return response.data
  },
}
