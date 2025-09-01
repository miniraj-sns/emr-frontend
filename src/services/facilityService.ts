import { apiClient } from './authService'

// Types
export interface Facility {
  id: number
  uuid: string
  name: string
  color?: string
  physical_address?: string
  physical_city?: string
  physical_state?: string
  physical_zip_code?: string
  physical_country?: string
  mailing_address?: string
  mailing_city?: string
  mailing_state?: string
  mailing_zip_code?: string
  mailing_country?: string
  phone?: string
  fax?: string
  website?: string
  email?: string
  pos_code?: string
  clia_number?: string
  tax_id_type?: string
  tax_id?: string
  facility_npi?: string
  iban?: string
  facility_taxonomy?: string
  billing_attn?: string
  facility_lab_code?: string
  oid?: string
  is_billing_location: boolean
  accepts_assignment: boolean
  is_service_location: boolean
  is_primary_business_entity: boolean
  is_inactive: boolean
  info?: string
  created_at: string
  updated_at: string
  full_physical_address?: string
  full_mailing_address?: string
  status?: string
  locations?: Array<{
    id: number
    name: string
    city?: string
    state?: string
    location_type: string
    pivot?: {
      is_primary: boolean
      is_billing_location: boolean
      is_service_location: boolean
      notes?: string
    }
  }>
}

export interface CreateFacilityRequest {
  name: string
  color?: string
  physical_address?: string
  physical_city?: string
  physical_state?: string
  physical_zip_code?: string
  physical_country?: string
  mailing_address?: string
  mailing_city?: string
  mailing_state?: string
  mailing_zip_code?: string
  mailing_country?: string
  phone?: string
  fax?: string
  website?: string
  email?: string
  pos_code?: string
  clia_number?: string
  tax_id_type?: string
  tax_id?: string
  facility_npi?: string
  iban?: string
  facility_taxonomy?: string
  billing_attn?: string
  facility_lab_code?: string
  oid?: string
  is_billing_location?: boolean
  accepts_assignment?: boolean
  is_service_location?: boolean
  is_primary_business_entity?: boolean
  is_inactive?: boolean
  info?: string
  location_assignments?: Array<{
    location_id: number
    is_primary: boolean
    is_billing_location: boolean
    is_service_location: boolean
    notes?: string
  }>
}

export interface UpdateFacilityRequest extends CreateFacilityRequest {}

// API Methods
export const facilityService = {
  // Get all facilities
  async getFacilities(params?: { search?: string; status?: string }): Promise<{ facilities: Facility[] }> {
    const response = await apiClient.get(`/facilities`, {
      params
    })
    return response.data
  },

  // Get a specific facility
  async getFacility(id: number): Promise<{ facility: Facility }> {
    const response = await apiClient.get(`/facilities/${id}`)
    return response.data
  },

  // Create a new facility
  async createFacility(data: CreateFacilityRequest): Promise<{ facility: Facility; message: string }> {
    const response = await apiClient.post(`/facilities`, data)
    return response.data
  },

  // Update a facility
  async updateFacility(id: number, data: UpdateFacilityRequest): Promise<{ facility: Facility; message: string }> {
    const response = await apiClient.put(`/facilities/${id}`, data)
    return response.data
  },

  // Delete a facility
  async deleteFacility(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/facilities/${id}`)
    return response.data
  }
}

export default facilityService
