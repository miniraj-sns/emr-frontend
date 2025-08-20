import React, { useState, useEffect } from 'react'
import { Lead } from '../../features/crm/crmSlice'
import { crmService } from '../../services/crmService'

interface LeadConversionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (conversionType?: string) => void
  lead: Lead | null
}

interface ConversionOptions {
  can_convert_to_contact: boolean
  can_convert_to_opportunity: boolean
  can_convert_to_patient: boolean
  current_stage: string
  current_status: string
  stages: Record<string, string>
}

const LeadConversionModal: React.FC<LeadConversionModalProps> = ({ isOpen, onClose, onSuccess, lead }) => {
  const [conversionType, setConversionType] = useState<string>('')
  const [options, setOptions] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    notes: '',
    amount: '',
    probability: '',
    expected_close_date: ''
  })

  useEffect(() => {
    if (isOpen && lead) {
      loadConversionOptions()
    }
  }, [isOpen, lead])

  const loadConversionOptions = async () => {
    try {
      const options = await crmService.getLeadConversionOptions(lead.id)
      setOptions(options)
    } catch (error) {
      console.error('Failed to load conversion options:', error)
    }
  }

  const handleConversion = async () => {
    if (!lead || !options || !conversionType) return;
    setLoading(true);
    try {
      switch (conversionType) {
        case 'contact':
          await crmService.convertLeadToContact(lead.id, {
            stage: 'contact',
            notes: formData.notes
          });
          onSuccess('contact');
          break;
        case 'opportunity':
          await crmService.convertLeadToOpportunity(lead.id, {
            amount: parseFloat(formData.amount),
            stage: 'proposal',
            probability: formData.probability,
            expected_close_date: formData.expected_close_date,
            notes: formData.notes
          });
          onSuccess('opportunity');
          break;
        case 'patient':
          // Direct conversion to patient
          await crmService.convertLeadToPatient(lead.id, {
            stage: 'converted',
            notes: formData.notes
          });
          onSuccess('patient');
          break;
        case 'patient_direct':
          // Direct patient creation without intermediate steps
          await crmService.createPatientFromLead(lead.id, {
            notes: formData.notes
          });
          onSuccess('patient_direct');
          break;
      }
      onClose();
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Convert Lead: {lead?.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Choose how you want to convert this lead
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Conversion Options */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Select Conversion Type:</h4>
            
            {/* Convert to Contact */}
            {options?.can_convert_to_contact && (
              <button
                onClick={() => setConversionType('contact')}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                  conversionType === 'contact'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">👥 Convert to Contact</div>
                <div className="text-sm text-gray-500">Convert lead to a business contact</div>
              </button>
            )}

            {/* Convert to Opportunity */}
            {options?.can_convert_to_opportunity && (
              <button
                onClick={() => setConversionType('opportunity')}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                  conversionType === 'opportunity'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">💰 Convert to Opportunity</div>
                <div className="text-sm text-gray-500">Create a sales opportunity</div>
              </button>
            )}

            {/* Convert to Patient (2-Step) */}
            {options?.can_convert_to_patient && (
              <button
                onClick={() => setConversionType('patient')}
                className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                  conversionType === 'patient'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">🏥 Convert to Patient (2-Step)</div>
                <div className="text-sm text-gray-500">First convert to contact, then to patient</div>
                <div className="text-xs text-green-600 mt-1">
                  Step 1: Lead → Contact | Step 2: Contact → Patient
                </div>
              </button>
            )}

            {/* Direct Patient Creation (NEW) */}
            <button
              onClick={() => setConversionType('patient_direct')}
              className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                conversionType === 'patient_direct'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">⚡ Create Patient Directly</div>
              <div className="text-sm text-gray-500">Create patient record directly from lead</div>
              <div className="text-xs text-red-600 mt-1">
                Fastest way - creates patient immediately
              </div>
            </button>
          </div>

          {/* Conversion Process Info */}
          {conversionType === 'patient' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Two-Step Conversion Process:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2">1</span>
                  <span>Convert lead to contact</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2">2</span>
                  <span>Convert contact to patient</span>
                </div>
              </div>
            </div>
          )}

          {conversionType === 'patient_direct' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Direct Patient Creation:</h4>
              <div className="text-sm text-red-700 space-y-1">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs mr-2">⚡</span>
                  <span>Creates patient record immediately</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs mr-2">📋</span>
                  <span>Copies lead data to patient fields</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✅</span>
                  <span>Skips intermediate contact step</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any notes about this conversion..."
              />
            </div>

            {/* Opportunity-specific fields */}
            {conversionType === 'opportunity' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Probability (%)
                  </label>
                  <input
                    type="number"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="50"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Close Date
                  </label>
                  <input
                    type="date"
                    value={formData.expected_close_date}
                    onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConversion}
            disabled={!conversionType || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Converting...' : 'Convert Lead'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadConversionModal;
