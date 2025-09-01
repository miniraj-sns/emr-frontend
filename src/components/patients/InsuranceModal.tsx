import React, { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import { 
  PatientInsurance,
  CreatePatientInsuranceRequest,
  UpdatePatientInsuranceRequest,
  InsuranceCompany
} from '../../services/insuranceService'

interface InsuranceModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: number
  insurance?: PatientInsurance | null
  type: 'primary' | 'secondary'
  insuranceCompanies: InsuranceCompany[]
  onSave: (data: CreatePatientInsuranceRequest | UpdatePatientInsuranceRequest) => Promise<void>
}

const InsuranceModal: React.FC<InsuranceModalProps> = ({
  isOpen,
  onClose,
  patientId,
  insurance,
  type,
  insuranceCompanies,
  onSave
}) => {
  const [formData, setFormData] = useState<CreatePatientInsuranceRequest>({
    insurance_company_id: 0,
    type: type,
    policy_number: '',
    group_number: '',
    subscriber_name: '',
    subscriber_relationship: 'self',
    effective_date: new Date().toISOString().split('T')[0],
    expiration_date: '',
    copay_amount: undefined,
    deductible_amount: undefined,
    coinsurance_percentage: undefined,
    out_of_pocket_maximum: undefined,
    status: 'active',
    notes: ''
  })
  
  const [loading, setLoading] = useState(false)

  // Set form data when editing
  useEffect(() => {
    if (insurance) {
      setFormData({
        insurance_company_id: insurance.insurance_company_id,
        type: insurance.type,
        policy_number: insurance.policy_number,
        group_number: insurance.group_number || '',
        subscriber_name: insurance.subscriber_name,
        subscriber_relationship: insurance.subscriber_relationship || 'self',
        effective_date: insurance.effective_date.split('T')[0],
        expiration_date: insurance.expiration_date ? insurance.expiration_date.split('T')[0] : '',
        copay_amount: insurance.copay_amount || undefined,
        deductible_amount: insurance.deductible_amount || undefined,
        coinsurance_percentage: insurance.coinsurance_percentage || undefined,
        out_of_pocket_maximum: insurance.out_of_pocket_maximum || undefined,
        status: insurance.status,
        notes: insurance.notes || ''
      })
    } else {
      setFormData({
        insurance_company_id: 0,
        type: type,
        policy_number: '',
        group_number: '',
        subscriber_name: '',
        subscriber_relationship: 'self',
        effective_date: new Date().toISOString().split('T')[0],
        expiration_date: '',
        copay_amount: undefined,
        deductible_amount: undefined,
        coinsurance_percentage: undefined,
        out_of_pocket_maximum: undefined,
        status: 'active',
        notes: ''
      })
    }
  }, [insurance, type])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.insurance_company_id || !formData.policy_number || !formData.subscriber_name || !formData.effective_date) return

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving insurance:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      insurance_company_id: 0,
      type: type,
      policy_number: '',
      group_number: '',
      subscriber_name: '',
      subscriber_relationship: 'self',
      effective_date: new Date().toISOString().split('T')[0],
      expiration_date: '',
      copay_amount: undefined,
      deductible_amount: undefined,
      coinsurance_percentage: undefined,
      out_of_pocket_maximum: undefined,
      status: 'active',
      notes: ''
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={insurance ? `Edit ${type} Insurance` : `Add ${type} Insurance`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Insurance Company and Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Company *
            </label>
            <select
              value={formData.insurance_company_id}
              onChange={(e) => setFormData(prev => ({ ...prev, insurance_company_id: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={0}>Select Insurance Company</option>
              {insuranceCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name} ({company.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Type
            </label>
            <input
              type="text"
              value={formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          </div>
        </div>

        {/* Policy Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Policy Number *
            </label>
            <input
              type="text"
              value={formData.policy_number}
              onChange={(e) => setFormData(prev => ({ ...prev, policy_number: e.target.value }))}
              placeholder="Enter policy number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Number
            </label>
            <input
              type="text"
              value={formData.group_number}
              onChange={(e) => setFormData(prev => ({ ...prev, group_number: e.target.value }))}
              placeholder="Enter group number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Subscriber Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subscriber Name *
            </label>
            <input
              type="text"
              value={formData.subscriber_name}
              onChange={(e) => setFormData(prev => ({ ...prev, subscriber_name: e.target.value }))}
              placeholder="Enter subscriber name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <select
              value={formData.subscriber_relationship}
              onChange={(e) => setFormData(prev => ({ ...prev, subscriber_relationship: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="self">Self</option>
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
              <option value="parent">Parent</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date *
            </label>
            <input
              type="date"
              value={formData.effective_date}
              onChange={(e) => setFormData(prev => ({ ...prev, effective_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date
            </label>
            <input
              type="date"
              value={formData.expiration_date}
              onChange={(e) => setFormData(prev => ({ ...prev, expiration_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Financial Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Copay Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.copay_amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, copay_amount: e.target.value ? parseFloat(e.target.value) : undefined }))}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deductible Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.deductible_amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, deductible_amount: e.target.value ? parseFloat(e.target.value) : undefined }))}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coinsurance Percentage
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.coinsurance_percentage || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, coinsurance_percentage: e.target.value ? parseFloat(e.target.value) : undefined }))}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Out of Pocket Maximum
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.out_of_pocket_maximum || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, out_of_pocket_maximum: e.target.value ? parseFloat(e.target.value) : undefined }))}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
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
            disabled={loading || !formData.insurance_company_id || !formData.policy_number || !formData.subscriber_name || !formData.effective_date}
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
                {insurance ? 'Update Insurance' : 'Add Insurance'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default InsuranceModal

