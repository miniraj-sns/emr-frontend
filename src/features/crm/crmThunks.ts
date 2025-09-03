import { createAsyncThunk } from '@reduxjs/toolkit'
import { crmService } from '../../services/crmService'
import { 
  setLeads, 
  setLoading, 
  setError, 
  setPagination,
  setOpportunities,
  setFollowUps,
  setStatistics
} from './crmSlice'
import { CRMFilters } from '../../services/crmService'

export const fetchLeads = createAsyncThunk(
  'crm/fetchLeads',
  async (filters: CRMFilters, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await crmService.getLeads(filters)
      dispatch(setLeads(response.data))
      dispatch(setPagination({
        currentPage: filters.page || 1,
        totalPages: Math.ceil(response.total / (filters.per_page || 15)),
        totalItems: response.total
      }))
      return response
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch leads'))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

export const fetchOpportunities = createAsyncThunk(
  'crm/fetchOpportunities',
  async (filters: CRMFilters, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await crmService.getOpportunities(filters)
      dispatch(setOpportunities(response.data))
      return response
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch opportunities'))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

export const fetchFollowUps = createAsyncThunk(
  'crm/fetchFollowUps',
  async (filters: CRMFilters, { dispatch }) => {
    try {
      dispatch(setLoading(true))
      const response = await crmService.getFollowUps(filters)
      dispatch(setFollowUps(response.data))
      return response
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch follow-ups'))
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }
)

export const fetchStatistics = createAsyncThunk(
  'crm/fetchStatistics',
  async (_, { dispatch }) => {
    try {
      const response = await crmService.getStatistics()
      dispatch(setStatistics(response))
      return response
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
      // Don't throw error for statistics as it's not critical
    }
  }
)






