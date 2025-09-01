import React, { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import { 
  VitalSigns, 
  CreateVitalSignsRequest, 
  UpdateVitalSignsRequest
} from '../../services/vitalSignsService'

interface VitalSignsModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: number
  vitalSigns?: VitalSigns | null
  onSave: (data: CreateVitalSignsRequest | UpdateVitalSignsRequest) => Promise<void>
  mode: 'add' | 'edit'
}

const VitalSignsModal: React.FC<VitalSignsModalProps> = ({ 
  isOpen, 
  onClose, 
  patientId, 
  vitalSigns, 
  onSave, 
  mode 
}) => {
  const [formData, setFormData] = useState<CreateVitalSignsRequest>({
    height: '',
    weight: '',
    blood_pressure_systolic: undefined,
    blood_pressure_diastolic: undefined,
    temperature: undefined,
    heart_rate: undefined,
    oxygen_saturation: undefined,
    respiratory_rate: undefined,
    recorded_at: new Date().toISOString().split('T')[0],
    notes: ''
  })
  
  const [loading, setLoading] = useState(false)

  // Set form data when editing
  useEffect(() => {
    if (vitalSigns && mode === 'edit') {
      // Format the date for HTML date input (YYYY-MM-DD)
      const formatDate = (dateString: string | undefined) => {
        if (!dateString) return new Date().toISOString().split('T')[0]
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }

      setFormData({
        height: vitalSigns.height || '',
        weight: vitalSigns.weight || '',
        blood_pressure_systolic: vitalSigns.blood_pressure_systolic || undefined,
        blood_pressure_diastolic: vitalSigns.blood_pressure_diastolic || undefined,
        temperature: vitalSigns.temperature || undefined,
        heart_rate: vitalSigns.heart_rate || undefined,
        oxygen_saturation: vitalSigns.oxygen_saturation || undefined,
        respiratory_rate: vitalSigns.respiratory_rate || undefined,
        recorded_at: formatDate(vitalSigns.recorded_at),
        notes: vitalSigns.notes || ''
      })
    } else {
      setFormData({
        height: '',
        weight: '',
        blood_pressure_systolic: undefined,
        blood_pressure_diastolic: undefined,
        temperature: undefined,
        heart_rate: undefined,
        oxygen_saturation: undefined,
        respiratory_rate: undefined,
        recorded_at: new Date().toISOString().split('T')[0],
        notes: ''
      })
    }
  }, [vitalSigns, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.recorded_at) return

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving vital signs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      height: '',
      weight: '',
      blood_pressure_systolic: undefined,
      blood_pressure_diastolic: undefined,
      temperature: undefined,
      heart_rate: undefined,
      oxygen_saturation: undefined,
      respiratory_rate: undefined,
      recorded_at: new Date().toISOString().split('T')[0],
      notes: ''
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'add' ? 'Add Vital Signs' : 'Edit Vital Signs'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date and Provider Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Recorded *
            </label>
            <input
              type="date"
              value={formData.recorded_at}
              onChange={(e) => setFormData(prev => ({ ...prev, recorded_at: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recorded By
            </label>
            <input
              type="text"
              value="Administrator Administrator"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          </div>
        </div>

        {/* Height and Weight Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height
            </label>
            <input
              type="text"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
              placeholder="e.g., 5'9&quot; or 175 cm"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight
            </label>
            <input
              type="text"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              placeholder="e.g., 180 lbs or 82 kg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Blood Pressure Row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Pressure (Systolic)
            </label>
            <input
              type="number"
              value={formData.blood_pressure_systolic || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, blood_pressure_systolic: e.target.value ? parseInt(e.target.value) : undefined }))}
              placeholder="e.g., 120"
              min="50"
              max="300"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Pressure (Diastolic)
            </label>
            <input
              type="number"
              value={formData.blood_pressure_diastolic || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, blood_pressure_diastolic: e.target.value ? parseInt(e.target.value) : undefined }))}
              placeholder="e.g., 80"
              min="30"
              max="200"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <span className="text-sm text-gray-500">mmHg</span>
          </div>
        </div>

        {/* Temperature and Heart Rate Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature
            </label>
            <div className="flex">
              <input
                type="number"
                value={formData.temperature || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value ? parseFloat(e.target.value) : undefined }))}
                placeholder="e.g., 98.6"
                min="90"
                max="110"
                step="0.1"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-500">
                °F
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heart Rate
            </label>
            <div className="flex">
              <input
                type="number"
                value={formData.heart_rate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, heart_rate: e.target.value ? parseInt(e.target.value) : undefined }))}
                placeholder="e.g., 72"
                min="30"
                max="300"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-500">
                bpm
              </span>
            </div>
          </div>
        </div>

        {/* Oxygen Saturation and Respiratory Rate Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oxygen Saturation
            </label>
            <div className="flex">
              <input
                type="number"
                value={formData.oxygen_saturation || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, oxygen_saturation: e.target.value ? parseInt(e.target.value) : undefined }))}
                placeholder="e.g., 98"
                min="70"
                max="100"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-500">
                %
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Respiratory Rate
            </label>
            <div className="flex">
              <input
                type="number"
                value={formData.respiratory_rate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, respiratory_rate: e.target.value ? parseInt(e.target.value) : undefined }))}
                placeholder="e.g., 16"
                min="8"
                max="50"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-500">
                bpm
              </span>
            </div>
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
            placeholder="Enter any additional notes about the vital signs"
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
            disabled={loading || !formData.recorded_at}
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
                {mode === 'add' ? 'Add Vital Signs' : 'Update Vital Signs'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default VitalSignsModal

