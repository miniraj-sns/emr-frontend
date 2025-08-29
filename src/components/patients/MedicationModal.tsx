import React, { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import { 
  PatientMedication, 
  CreatePatientMedicationRequest, 
  UpdatePatientMedicationRequest 
} from '../../services/patientMasterDataService'
import masterDataService from '../../services/masterDataService'

interface MedicationModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: number
  medication?: PatientMedication | null
  onSave: (data: CreatePatientMedicationRequest | UpdatePatientMedicationRequest) => Promise<void>
  mode: 'add' | 'edit'
}

const MedicationModal: React.FC<MedicationModalProps> = ({ 
  isOpen, 
  onClose, 
  patientId, 
  medication, 
  onSave, 
  mode 
}) => {
  const [formData, setFormData] = useState<CreatePatientMedicationRequest>({
    master_medication_id: 0,
    medication_name: '',
    dosage: '',
    frequency: '',
    route: '',
    start_date: '',
    end_date: '',
    status: 'active',
    notes: ''
  })
  const [availableMedications, setAvailableMedications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMedications, setLoadingMedications] = useState(false)

  // Load available medications when modal opens
  useEffect(() => {
    if (isOpen && mode === 'add') {
      loadAvailableMedications()
    }
  }, [isOpen, mode, patientId])

  // Set form data when editing
  useEffect(() => {
    if (medication && mode === 'edit') {
      // Format the dates for HTML date input (YYYY-MM-DD)
      const formatDate = (dateString: string | undefined) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }

      setFormData({
        master_medication_id: medication.master_medication_id,
        medication_name: medication.medication_name,
        dosage: medication.dosage || '',
        frequency: medication.frequency || '',
        route: medication.route || '',
        start_date: formatDate(medication.start_date),
        end_date: formatDate(medication.end_date),
        status: medication.status,
        notes: medication.notes || ''
      })
    } else {
      setFormData({
        master_medication_id: 0,
        medication_name: '',
        dosage: '',
        frequency: '',
        route: '',
        start_date: '',
        end_date: '',
        status: 'active',
        notes: ''
      })
    }
  }, [medication, mode])

  const loadAvailableMedications = async () => {
    setLoadingMedications(true)
    try {
      const response = await masterDataService.getMedications({ per_page: 100 })
      setAvailableMedications(response.data)
    } catch (error) {
      console.error('Error loading medications:', error)
    } finally {
      setLoadingMedications(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.master_medication_id || !formData.medication_name) return

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving medication:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      master_medication_id: 0,
      medication_name: '',
      dosage: '',
      frequency: '',
      route: '',
      start_date: '',
      end_date: '',
      status: 'active',
      notes: ''
    })
    onClose()
  }

  const handleMedicationChange = (medicationId: number) => {
    const selectedMedication = availableMedications.find(med => med.id === medicationId)
    setFormData(prev => ({
      ...prev,
      master_medication_id: medicationId,
      medication_name: selectedMedication ? selectedMedication.name : ''
    }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'add' ? 'Add Medication' : 'Edit Medication'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Master Medication Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medication *
          </label>
          {mode === 'add' ? (
            <select
              value={formData.master_medication_id}
              onChange={(e) => handleMedicationChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loadingMedications}
            >
              <option value={0}>Select Medication</option>
              {availableMedications.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={medication?.medication_name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          )}
          {loadingMedications && (
            <p className="text-xs text-gray-500 mt-1">Loading medications...</p>
          )}
        </div>

        {/* Medication Name (for add mode) */}
        {mode === 'add' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medication Name *
            </label>
            <input
              type="text"
              value={formData.medication_name}
              onChange={(e) => setFormData(prev => ({ ...prev, medication_name: e.target.value }))}
              placeholder="Enter medication name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        )}

        {/* Dosage and Frequency Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dosage
            </label>
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
              placeholder="e.g., 500mg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <input
              type="text"
              value={formData.frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
              placeholder="e.g., Twice daily"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Route and Status Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Route
            </label>
            <input
              type="text"
              value={formData.route || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
              placeholder="e.g., Oral, IV"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="active">Active</option>
              <option value="discontinued">Discontinued</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Start and End Date Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.end_date || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes about the medication"
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
            disabled={loading || !formData.master_medication_id || !formData.medication_name}
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
                {mode === 'add' ? 'Add Medication' : 'Update Medication'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default MedicationModal
