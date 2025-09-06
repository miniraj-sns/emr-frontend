import { apiClient } from './authService'

// Types
export interface Location {
  id: number
  uuid: string
  name: string
  code?: string
  location_type: string
  color?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  is_active: boolean
  description?: string
  notes?: string
  created_at: string
  updated_at: string
  full_address?: string
  location_type_label?: string
  display_name?: string
}

export interface CreateLocationRequest {
  name: string
  code?: string
  location_type?: string
  color?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  phone?: string
  email?: string
  website?: string
  description?: string
  notes?: string
}

export interface UpdateLocationRequest extends CreateLocationRequest {
  is_active?: boolean
}

// API Methods
export const locationService = {
  // Get all locations
  async getLocations(params?: { search?: string; type?: string; status?: string }): Promise<{ locations: Location[] }> {
    const response = await apiClient.get(`/locations`, {
      params
    })
    return response.data
  },

  // Get a specific location
  async getLocation(id: number): Promise<{ location: Location }> {
    const response = await apiClient.get(`/locations/${id}`)
    return response.data
  },

  // Create a new location
  async createLocation(data: CreateLocationRequest): Promise<{ location: Location; message: string }> {
    const response = await apiClient.post(`/locations`, data)
    return response.data
  },

  // Update a location
  async updateLocation(id: number, data: UpdateLocationRequest): Promise<{ location: Location; message: string }> {
    const response = await apiClient.put(`/locations/${id}`, data)
    return response.data
  },

  // Delete a location
  async deleteLocation(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/locations/${id}`)
    return response.data
  }
}

export default locationService





