import React, { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import {
  PatientAllergy,
  CreatePatientAllergyRequest,
  UpdatePatientAllergyRequest
} from '../../services/patientMasterDataService'
import masterDataService from '../../services/masterDataService'

interface AllergyModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: number
  allergy?: PatientAllergy | null
  onSave: (data: CreatePatientAllergyRequest | UpdatePatientAllergyRequest) => Promise<void>
  mode: 'add' | 'edit'
}

const AllergyModal: React.FC<AllergyModalProps> = ({
  isOpen,
  onClose,
  patientId,
  allergy,
  onSave,
  mode
}) => {
  const [formData, setFormData] = useState<CreatePatientAllergyRequest>({
    master_allergy_id: 0,
    severity: 'moderate',
    reaction: '',
    onset_date: '',
    notes: ''
  })
  const [availableAllergies, setAvailableAllergies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAllergies, setLoadingAllergies] = useState(false)

  // Load available allergies when modal opens
  useEffect(() => {
    if (isOpen && mode === 'add') {
      loadAvailableAllergies()
    }
  }, [isOpen, mode, patientId])

  // Set form data when editing
  useEffect(() => {
    if (allergy && mode === 'edit') {
      // Format the onset_date for HTML date input (YYYY-MM-DD)
      const formatDate = (dateString: string | undefined) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }

      setFormData({
        master_allergy_id: allergy.master_allergy_id,
        severity: allergy.severity,
        reaction: allergy.reaction || '',
        onset_date: formatDate(allergy.onset_date),
        notes: allergy.notes || ''
      })
    } else {
      setFormData({
        master_allergy_id: 0,
        severity: 'moderate',
        reaction: '',
        onset_date: '',
        notes: ''
      })
    }
  }, [allergy, mode])

  const loadAvailableAllergies = async () => {
    setLoadingAllergies(true)
    try {
      const response = await masterDataService.getAllergies({ per_page: 100 })
      setAvailableAllergies(response.data)
    } catch (error) {
      console.error('Error loading allergies:', error)
    } finally {
      setLoadingAllergies(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.master_allergy_id) return

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving allergy:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      master_allergy_id: 0,
      severity: 'moderate',
      reaction: '',
      onset_date: '',
      notes: ''
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'add' ? 'Add Allergy' : 'Edit Allergy'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Master Allergy Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Allergy *
          </label>
          {mode === 'add' ? (
            <select
              value={formData.master_allergy_id}
              onChange={(e) => setFormData(prev => ({ ...prev, master_allergy_id: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loadingAllergies}
            >
              <option value={0}>Select Allergy</option>
              {availableAllergies.map((allergy) => (
                <option key={allergy.id} value={allergy.id}>
                  {allergy.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={allergy?.master_allergy?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          )}
          {loadingAllergies && (
            <p className="text-xs text-gray-500 mt-1">Loading allergies...</p>
          )}
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity *
          </label>
          <select
            value={formData.severity}
            onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>

        {/* Onset Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Onset Date
          </label>
          <input
            type="date"
            value={formData.onset_date || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, onset_date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Reaction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reaction
          </label>
          <input
            type="text"
            value={formData.reaction}
            onChange={(e) => setFormData(prev => ({ ...prev, reaction: e.target.value }))}
            placeholder="Describe the allergic reaction"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes about the allergy"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.master_allergy_id}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {mode === 'add' ? 'Add Allergy' : 'Update Allergy'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AllergyModal
