import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { 
  setShowOpportunityModal, 
  setSelectedOpportunity, 
  addOpportunity, 
  updateOpportunity,
  setLoading,
  setError 
} from '../../features/crm/crmSlice'
import { crmService } from '../../services/crmService'
import { Opportunity } from '../../features/crm/crmSlice'

interface OpportunityFormData {
  name: string
  lead_id: number | null
  amount: number
  stage: string
  probability: number
  expected_close_date: string
  notes: string
}

const OpportunityFormModal: React.FC = () => {
  const dispatch = useDispatch()
  const { showOpportunityModal, selectedOpportunity, isLoading } = useSelector((state: RootState) => state.crm)
  
  const [formData, setFormData] = useState<OpportunityFormData>({
    name: '',
    lead_id: null,
    amount: 0,
    stage: 'prospecting',
    probability: 10,
    expected_close_date: '',
    notes: ''
  })
  
  const [errors, setErrors] = useState<Partial<OpportunityFormData>>({})
  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => {
    if (showOpportunityModal) {
      loadLeads()
    }
  }, [showOpportunityModal])

  useEffect(() => {
    if (selectedOpportunity) {
      setFormData({
        name: selectedOpportunity.name || '',
        lead_id: selectedOpportunity.lead_id || null,
        amount: selectedOpportunity.amount || 0,
        stage: selectedOpportunity.stage || 'prospecting',
        probability: selectedOpportunity.probability || 10,
        expected_close_date: selectedOpportunity.expected_close_date ? new Date(selectedOpportunity.expected_close_date).toISOString().split('T')[0] : '',
        notes: selectedOpportunity.notes || ''
      })
    } else {
      setFormData({
        name: '',
        lead_id: null,
        amount: 0,
        stage: 'prospecting',
        probability: 10,
        expected_close_date: '',
        notes: ''
      })
    }
    setErrors({})
  }, [selectedOpportunity])

  const loadLeads = async () => {
    try {
      const response = await crmService.getLeads({ per_page: 100 })
      setLeads(response.data)
    } catch (err) {
      console.error('Failed to load leads:', err)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<OpportunityFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Opportunity name is required'
    }

    if (formData.amount < 0) {
      newErrors.amount = 'Amount must be positive'
    }

    if (formData.probability < 0 || formData.probability > 100) {
      newErrors.probability = 'Probability must be between 0 and 100'
    }

    if (formData.expected_close_date && new Date(formData.expected_close_date) < new Date()) {
      newErrors.expected_close_date = 'Close date cannot be in the past'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      dispatch(setLoading(true))
      
      if (selectedOpportunity) {
        const updatedOpportunity = await crmService.updateOpportunity(selectedOpportunity.id, formData)
        dispatch(updateOpportunity(updatedOpportunity))
      } else {
        const newOpportunity = await crmService.createOpportunity(formData)
        dispatch(addOpportunity(newOpportunity))
      }
      
      handleClose()
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to save opportunity'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleClose = () => {
    dispatch(setShowOpportunityModal(false))
    dispatch(setSelectedOpportunity(null))
  }

  const handleInputChange = (field: keyof OpportunityFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!showOpportunityModal) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedOpportunity ? 'Edit Opportunity' : 'Create New Opportunity'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Opportunity Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opportunity Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter opportunity name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Lead Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Associated Lead
              </label>
              <select
                value={formData.lead_id || ''}
                onChange={(e) => handleInputChange('lead_id', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a lead (optional)</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} - {lead.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount and Probability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Probability (%)
                </label>
                <input
                  type="number"
                  value={formData.probability}
                  onChange={(e) => handleInputChange('probability', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.probability ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10"
                  min="0"
                  max="100"
                />
                {errors.probability && <p className="text-red-500 text-sm mt-1">{errors.probability}</p>}
              </div>
            </div>

            {/* Stage and Close Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="prospecting">Prospecting</option>
                  <option value="qualification">Qualification</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Close Date
                </label>
                <input
                  type="date"
                  value={formData.expected_close_date}
                  onChange={(e) => handleInputChange('expected_close_date', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expected_close_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expected_close_date && <p className="text-red-500 text-sm mt-1">{errors.expected_close_date}</p>}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any additional notes about this opportunity..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (selectedOpportunity ? 'Update Opportunity' : 'Create Opportunity')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OpportunityFormModal





