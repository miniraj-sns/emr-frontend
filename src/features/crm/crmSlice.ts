import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Contact, Opportunity, FollowUp, CRMStatistics, CRMFilters } from '../../services/crmService'

export interface Lead {
  id: number
  name: string
  email: string
  phone: string
  source: string
  status: string
  pipeline_id: number
  stage: string
  notes: string
  metadata: any
  created_at: string
  updated_at: string
  // Computed properties for backward compatibility
  first_name?: string
  last_name?: string
  company?: string
}

export interface CRMState {
  // Data
  leads: Lead[]
  contacts: Contact[]
  opportunities: Opportunity[]
  followUps: FollowUp[]
  statistics: CRMStatistics | null
  
  // UI State
  isLoading: boolean
  error: string | null
  
  // Filters and Pagination
  filters: CRMFilters
  currentPage: number
  totalPages: number
  totalItems: number
  
  // Selected Items
  selectedLead: Lead | null
  selectedContact: Contact | null
  selectedOpportunity: Opportunity | null
  selectedFollowUp: FollowUp | null
  
  // Modal States
  showLeadModal: boolean
  showContactModal: boolean
  showOpportunityModal: boolean
  showFollowUpModal: boolean
}

const initialState: CRMState = {
  // Data
  leads: [],
  contacts: [],
  opportunities: [],
  followUps: [],
  statistics: null,
  
  // UI State
  isLoading: false,
  error: null,
  
  // Filters and Pagination
  filters: {},
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  
  // Selected Items
  selectedLead: null,
  selectedContact: null,
  selectedOpportunity: null,
  selectedFollowUp: null,
  
  // Modal States
  showLeadModal: false,
  showContactModal: false,
  showOpportunityModal: false,
  showFollowUpModal: false,
}

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    // Lead Actions
    setLeads: (state, action: PayloadAction<Lead[]>) => {
      state.leads = action.payload
    },
    addLead: (state, action: PayloadAction<Lead>) => {
      state.leads.unshift(action.payload)
    },
    updateLead: (state, action: PayloadAction<Lead>) => {
      const index = state.leads.findIndex(lead => lead.id === action.payload.id)
      if (index !== -1) {
        state.leads[index] = action.payload
      }
    },
    removeLead: (state, action: PayloadAction<number>) => {
      state.leads = state.leads.filter(lead => lead.id !== action.payload)
    },
    
    // Contact Actions
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload
    },
    addContact: (state, action: PayloadAction<Contact>) => {
      state.contacts.unshift(action.payload)
    },
    updateContact: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex(contact => contact.id === action.payload.id)
      if (index !== -1) {
        state.contacts[index] = action.payload
      }
    },
    removeContact: (state, action: PayloadAction<number>) => {
      state.contacts = state.contacts.filter(contact => contact.id !== action.payload)
    },
    
    // Opportunity Actions
    setOpportunities: (state, action: PayloadAction<Opportunity[]>) => {
      state.opportunities = action.payload
    },
    addOpportunity: (state, action: PayloadAction<Opportunity>) => {
      state.opportunities.unshift(action.payload)
    },
    updateOpportunity: (state, action: PayloadAction<Opportunity>) => {
      const index = state.opportunities.findIndex(opp => opp.id === action.payload.id)
      if (index !== -1) {
        state.opportunities[index] = action.payload
      }
    },
    removeOpportunity: (state, action: PayloadAction<number>) => {
      state.opportunities = state.opportunities.filter(opp => opp.id !== action.payload)
    },
    
    // Follow-up Actions
    setFollowUps: (state, action: PayloadAction<FollowUp[]>) => {
      state.followUps = action.payload
    },
    addFollowUp: (state, action: PayloadAction<FollowUp>) => {
      state.followUps.unshift(action.payload)
    },
    updateFollowUp: (state, action: PayloadAction<FollowUp>) => {
      const index = state.followUps.findIndex(followUp => followUp.id === action.payload.id)
      if (index !== -1) {
        state.followUps[index] = action.payload
      }
    },
    removeFollowUp: (state, action: PayloadAction<number>) => {
      state.followUps = state.followUps.filter(followUp => followUp.id !== action.payload)
    },
    
    // Statistics
    setStatistics: (state, action: PayloadAction<CRMStatistics>) => {
      state.statistics = action.payload
    },
    
    // UI State
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    // Filters and Pagination
    setFilters: (state, action: PayloadAction<CRMFilters>) => {
      state.filters = action.payload
    },
    setPagination: (state, action: PayloadAction<{ currentPage: number; totalPages: number; totalItems: number }>) => {
      state.currentPage = action.payload.currentPage
      state.totalPages = action.payload.totalPages
      state.totalItems = action.payload.totalItems
    },
    
    // Selected Items
    setSelectedLead: (state, action: PayloadAction<Lead | null>) => {
      state.selectedLead = action.payload
    },
    setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
      state.selectedContact = action.payload
    },
    setSelectedOpportunity: (state, action: PayloadAction<Opportunity | null>) => {
      state.selectedOpportunity = action.payload
    },
    setSelectedFollowUp: (state, action: PayloadAction<FollowUp | null>) => {
      state.selectedFollowUp = action.payload
    },
    
    // Modal States
    setShowLeadModal: (state, action: PayloadAction<boolean>) => {
      state.showLeadModal = action.payload
    },
    setShowContactModal: (state, action: PayloadAction<boolean>) => {
      state.showContactModal = action.payload
    },
    setShowOpportunityModal: (state, action: PayloadAction<boolean>) => {
      state.showOpportunityModal = action.payload
    },
    setShowFollowUpModal: (state, action: PayloadAction<boolean>) => {
      state.showFollowUpModal = action.payload
    },
    
    // Reset State
    resetCRMState: (state) => {
      state.leads = []
      state.contacts = []
      state.opportunities = []
      state.followUps = []
      state.statistics = null
      state.isLoading = false
      state.error = null
      state.filters = {}
      state.currentPage = 1
      state.totalPages = 1
      state.totalItems = 0
      state.selectedLead = null
      state.selectedContact = null
      state.selectedOpportunity = null
      state.selectedFollowUp = null
      state.showLeadModal = false
      state.showContactModal = false
      state.showOpportunityModal = false
      state.showFollowUpModal = false
    },
  },
})

export const {
  setLeads,
  addLead,
  updateLead,
  removeLead,
  setContacts,
  addContact,
  updateContact,
  removeContact,
  setOpportunities,
  addOpportunity,
  updateOpportunity,
  removeOpportunity,
  setFollowUps,
  addFollowUp,
  updateFollowUp,
  removeFollowUp,
  setStatistics,
  setLoading,
  setError,
  setFilters,
  setPagination,
  setSelectedLead,
  setSelectedContact,
  setSelectedOpportunity,
  setSelectedFollowUp,
  setShowLeadModal,
  setShowContactModal,
  setShowOpportunityModal,
  setShowFollowUpModal,
  resetCRMState,
} = crmSlice.actions

export default crmSlice.reducer 