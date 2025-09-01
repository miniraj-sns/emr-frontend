import React, { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import { 
  Prescription, 
  CreatePrescriptionRequest, 
  UpdatePrescriptionRequest,
  MasterUnit,
  MasterRoute,
  MasterInterval
} from '../../services/prescriptionService'
import prescriptionService from '../../services/prescriptionService'

interface PrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: number
  prescription?: Prescription | null
  onSave: (data: CreatePrescriptionRequest | UpdatePrescriptionRequest) => Promise<void>
  mode: 'add' | 'edit'
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  patientId, 
  prescription, 
  onSave, 
  mode 
}) => {
  const [formData, setFormData] = useState<CreatePrescriptionRequest>({
    starting_date: '',
    drug_name: '',
    drug_type: 'default',
    quantity: 0,
    size: '',
    unit_id: undefined,
    directions: '',
    route_id: undefined,
    interval_id: undefined,
    refills: 0,
    refill_quantity: 0,
    notes: '',
    substitution: 'substitution allowed'
  })
  
  const [masterUnits, setMasterUnits] = useState<MasterUnit[]>([])
  const [masterRoutes, setMasterRoutes] = useState<MasterRoute[]>([])
  const [masterIntervals, setMasterIntervals] = useState<MasterInterval[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMasterData, setLoadingMasterData] = useState(false)

  // Load master data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMasterData()
    }
  }, [isOpen])

  // Set form data when editing
  useEffect(() => {
    if (prescription && mode === 'edit') {
      // Format the date for HTML date input (YYYY-MM-DD)
      const formatDate = (dateString: string | undefined) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }

      setFormData({
        starting_date: formatDate(prescription.starting_date),
        drug_name: prescription.drug_name,
        drug_type: prescription.drug_type,
        quantity: prescription.quantity,
        size: prescription.size || '',
        unit_id: prescription.unit_id || undefined,
        directions: prescription.directions || '',
        route_id: prescription.route_id || undefined,
        interval_id: prescription.interval_id || undefined,
        refills: prescription.refills,
        refill_quantity: prescription.refill_quantity,
        notes: prescription.notes || '',
        substitution: prescription.substitution
      })
    } else {
      setFormData({
        starting_date: '',
        drug_name: '',
        drug_type: 'default',
        quantity: 0,
        size: '',
        unit_id: undefined,
        directions: '',
        route_id: undefined,
        interval_id: undefined,
        refills: 0,
        refill_quantity: 0,
        notes: '',
        substitution: 'substitution allowed'
      })
    }
  }, [prescription, mode])

  const loadMasterData = async () => {
    setLoadingMasterData(true)
    try {
      const [unitsResponse, routesResponse, intervalsResponse] = await Promise.all([
        prescriptionService.getMasterUnits(),
        prescriptionService.getMasterRoutes(),
        prescriptionService.getMasterIntervals()
      ])
      
      console.log('Units Response:', unitsResponse)
      console.log('Routes Response:', routesResponse)
      console.log('Intervals Response:', intervalsResponse)
      
      // Handle both paginated and direct array responses
      const unitsData = unitsResponse?.data?.data || unitsResponse?.data || unitsResponse || []
      const routesData = routesResponse?.data?.data || routesResponse?.data || routesResponse || []
      const intervalsData = intervalsResponse?.data?.data || intervalsResponse?.data || intervalsResponse || []
      
      console.log('Units Data:', unitsData)
      console.log('Routes Data:', routesData)
      console.log('Intervals Data:', intervalsData)
      
      // Ensure we have arrays
      setMasterUnits(Array.isArray(unitsData) ? unitsData : [])
      setMasterRoutes(Array.isArray(routesData) ? routesData : [])
      setMasterIntervals(Array.isArray(intervalsData) ? intervalsData : [])
    } catch (error) {
      console.error('Error loading master data:', error)
      // Set empty arrays on error to prevent crashes
      setMasterUnits([])
      setMasterRoutes([])
      setMasterIntervals([])
    } finally {
      setLoadingMasterData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.drug_name || !formData.starting_date) return

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving prescription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      starting_date: '',
      drug_name: '',
      drug_type: 'default',
      quantity: 0,
      size: '',
      unit_id: undefined,
      directions: '',
      route_id: undefined,
      interval_id: undefined,
      refills: 0,
      refill_quantity: 0,
      notes: '',
      substitution: 'substitution allowed'
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'add' ? 'Add Prescription' : 'Edit Prescription'}
      size="xl"
    >
      {loadingMasterData && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-gray-600">Loading master data...</span>
        </div>
      )}
      {!loadingMasterData && (
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Starting Date and Provider Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Date *
            </label>
            <input
              type="date"
              value={formData.starting_date}
              onChange={(e) => setFormData(prev => ({ ...prev, starting_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider
            </label>
            <input
              type="text"
              value="Administrator Administrator"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          </div>
        </div>

        {/* Drug Type and Drug Name Row */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Drug Type
          </label>
          <div className="space-y-2">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="drug_type"
                  value="default"
                  checked={formData.drug_type === 'default'}
                  onChange={(e) => setFormData(prev => ({ ...prev, drug_type: e.target.value as any }))}
                  className="mr-2"
                />
                Use Default
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="drug_type"
                  value="rxnorm"
                  checked={formData.drug_type === 'rxnorm'}
                  onChange={(e) => setFormData(prev => ({ ...prev, drug_type: e.target.value as any }))}
                  className="mr-2"
                />
                Use RxNorm
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="drug_type"
                  value="rxcui"
                  checked={formData.drug_type === 'rxcui'}
                  onChange={(e) => setFormData(prev => ({ ...prev, drug_type: e.target.value as any }))}
                  className="mr-2"
                />
                Use RxCUI
              </label>
            </div>
            <input
              type="text"
              value={formData.drug_name}
              onChange={(e) => setFormData(prev => ({ ...prev, drug_name: e.target.value }))}
              placeholder="Enter drug name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Quantity and Medicine Units Row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              placeholder="e.g., 30"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
              placeholder="Tablet size"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              value={formData.unit_id || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, unit_id: e.target.value ? parseInt(e.target.value) : undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loadingMasterData}
            >
                             <option value="">Select Unit</option>
               {Array.isArray(masterUnits) ? masterUnits.map((unit) => (
                 <option key={unit.id} value={unit.id}>
                   {unit.name}
                 </option>
               )) : null}
            </select>
          </div>
        </div>

        {/* Directions Row */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Directions
          </label>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              value={formData.directions}
              onChange={(e) => setFormData(prev => ({ ...prev, directions: e.target.value }))}
              placeholder="e.g., Take 1 tablet"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={formData.route_id || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, route_id: e.target.value ? parseInt(e.target.value) : undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loadingMasterData}
            >
                             <option value="">Select Route</option>
               {Array.isArray(masterRoutes) ? masterRoutes.map((route) => (
                 <option key={route.id} value={route.id}>
                   {route.name}
                 </option>
               )) : null}
            </select>
            <select
              value={formData.interval_id || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, interval_id: e.target.value ? parseInt(e.target.value) : undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loadingMasterData}
            >
                             <option value="">Select Interval</option>
               {Array.isArray(masterIntervals) ? masterIntervals.map((interval) => (
                 <option key={interval.id} value={interval.id}>
                   {interval.name}
                 </option>
               )) : null}
            </select>
          </div>
        </div>

        {/* Refills Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Refills
            </label>
            <input
              type="number"
              value={formData.refills}
              onChange={(e) => setFormData(prev => ({ ...prev, refills: parseInt(e.target.value) || 0 }))}
              placeholder="00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              # of tablets
            </label>
            <input
              type="number"
              value={formData.refill_quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, refill_quantity: parseInt(e.target.value) || 0 }))}
              placeholder="0"
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
            placeholder="Enter any additional notes"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Substitute and Medication Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Substitute
            </label>
            <select
              value={formData.substitution}
              onChange={(e) => setFormData(prev => ({ ...prev, substitution: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="substitution allowed">substitution allowed</option>
              <option value="no substitution">no substitution</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medication
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="medication"
                  value="no"
                  className="mr-2"
                  defaultChecked
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="medication"
                  value="yes"
                  className="mr-2"
                />
                Yes
              </label>
            </div>
          </div>
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
            disabled={loading || !formData.drug_name || !formData.starting_date}
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
                {mode === 'add' ? 'Add Prescription' : 'Update Prescription'}
              </>
            )}
          </button>
                 </div>
       </form>
       )}
     </Modal>
  )
}

export default PrescriptionModal
