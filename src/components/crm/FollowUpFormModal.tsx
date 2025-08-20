import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { 
  setShowFollowUpModal, 
  setSelectedFollowUp, 
  addFollowUp, 
  updateFollowUp,
  setLoading,
  setError 
} from '../../features/crm/crmSlice'
import { crmService } from '../../services/crmService'
import { FollowUp } from '../../features/crm/crmSlice'

interface FollowUpFormData {
  contact_id: number | null
  entityType: 'lead' | 'contact' | 'opportunity'
  type: string
  subject: string
  description: string
  scheduled_date: string
  completed: boolean
}

const FollowUpFormModal: React.FC = () => {
  const dispatch = useDispatch()
  const { showFollowUpModal, selectedFollowUp, isLoading } = useSelector((state: RootState) => state.crm)
  
  const [formData, setFormData] = useState<FollowUpFormData>({
    contact_id: null,
    entityType: 'contact',
    type: 'call',
    subject: '',
    description: '',
    scheduled_date: '',
    completed: false
  })
  
  const [errors, setErrors] = useState<Partial<FollowUpFormData>>({})
  const [contacts, setContacts] = useState<any[]>([])

  useEffect(() => {
    if (showFollowUpModal) {
      loadContacts()
    }
  }, [showFollowUpModal])

  useEffect(() => {
    if (selectedFollowUp) {
      setFormData({
        contact_id: selectedFollowUp.contact_id,
        entityType: 'contact',
        type: selectedFollowUp.type,
        subject: selectedFollowUp.subject,
        description: selectedFollowUp.description,
        scheduled_date: selectedFollowUp.scheduled_date ? new Date(selectedFollowUp.scheduled_date).toISOString().slice(0, 16) : '',
        completed: selectedFollowUp.completed
      })
    } else {
      setFormData({
        contact_id: null,
        entityType: 'contact',
        type: 'call',
        subject: '',
        description: '',
        scheduled_date: '',
        completed: false
      })
    }
    setErrors({})
  }, [selectedFollowUp])

  const loadContacts = async () => {
    try {
      // Load contacts by default; if user switches to 'lead', also include non-converted leads
      const [contactsResp, leadsResp] = await Promise.all([
        crmService.getContacts({ per_page: 100 }),
        crmService.getLeads({ per_page: 100 })
      ])
      const merged = [
        ...contactsResp.data.map(c => ({ id: c.id, first_name: c.first_name, last_name: c.last_name, email: c.email, kind: 'contact' })),
        ...leadsResp.data.map((l: any) => ({ id: l.id, first_name: l.name, last_name: '', email: l.email, kind: 'lead' }))
      ]
      setContacts(merged)
    } catch (err) {
      console.error('Failed to load contacts:', err)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FollowUpFormData> = {}

    if (!formData.contact_id) {
      newErrors.contact_id = 'Contact is required'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.scheduled_date) {
      newErrors.scheduled_date = 'Scheduled date is required'
    }

    if (formData.scheduled_date && new Date(formData.scheduled_date) < new Date()) {
      newErrors.scheduled_date = 'Scheduled date cannot be in the past'
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
      
      if (selectedFollowUp) {
        const updatedFollowUp = await crmService.updateFollowUp(selectedFollowUp.id, formData)
        dispatch(updateFollowUp(updatedFollowUp))
      } else {
        const newFollowUp = await crmService.createFollowUp(formData)
        dispatch(addFollowUp(newFollowUp))
      }
      
      handleClose()
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Failed to save follow-up'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleClose = () => {
    dispatch(setShowFollowUpModal(false))
    dispatch(setSelectedFollowUp(null))
  }

  const handleInputChange = (field: keyof FollowUpFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!showFollowUpModal) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedFollowUp ? 'Edit Follow-up' : 'Create New Follow-up'}
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
            {/* Entity Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link To</label>
              <select
                value={formData.entityType}
                onChange={(e) => handleInputChange('entityType', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="contact">Contact</option>
                <option value="lead">Lead</option>
                <option value="opportunity">Opportunity</option>
              </select>
            </div>
            {/* Contact Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.entityType === 'lead' ? 'Lead *' : formData.entityType === 'opportunity' ? 'Opportunity *' : 'Contact *'}
              </label>
              <select
                value={formData.contact_id || ''}
                onChange={(e) => handleInputChange('contact_id', e.target.value ? parseInt(e.target.value) : null)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.contact_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select</option>
                {contacts
                  .filter((c: any) => (formData.entityType === 'lead' ? c.kind === 'lead' : c.kind === 'contact'))
                  .map((contact: any) => (
                    <option key={contact.id} value={contact.id}>
                      {(contact.first_name || '') + ' ' + (contact.last_name || '')} - {contact.email}
                    </option>
                  ))}
              </select>
              {errors.contact_id && <p className="text-red-500 text-sm mt-1">{errors.contact_id}</p>}
            </div>

            {/* Type and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="note">Note</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter follow-up subject"
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.scheduled_date}
                onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.scheduled_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.scheduled_date && <p className="text-red-500 text-sm mt-1">{errors.scheduled_date}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add details about this follow-up..."
              />
            </div>

            {/* Completed Status */}
            {selectedFollowUp && (
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.completed}
                    onChange={(e) => handleInputChange('completed', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Mark as completed</span>
                </label>
              </div>
            )}

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
                {isLoading ? 'Saving...' : (selectedFollowUp ? 'Update Follow-up' : 'Create Follow-up')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FollowUpFormModal
