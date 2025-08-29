import React, { useState } from 'react'
import { crmService } from '../../services/crmService'

interface ContactToPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  contact: any
}

const ContactToPatientModal: React.FC<ContactToPatientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  contact
}) => {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')

  const handleConversion = async () => {
    if (!contact) return
    setLoading(true)

    try {
      await crmService.convertContactToPatient(contact.id, {
        notes: notes || `Converted from contact: ${contact.name}`
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to convert contact to patient:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !contact) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Convert Contact to Patient
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Convert "{contact.name}" to a patient record
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Contact Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Contact Information</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Name:</strong> {contact.name}</p>
              <p><strong>Email:</strong> {contact.email}</p>
              <p><strong>Phone:</strong> {contact.phone}</p>
              {contact.company && <p><strong>Company:</strong> {contact.company}</p>}
            </div>
          </div>

          {/* Conversion Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">What will happen:</h4>
            <div className="text-sm text-green-700 space-y-1">
              <div className="flex items-center">
                <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>
                <span>Create new patient record</span>
              </div>
              <div className="flex items-center">
                <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>
                <span>Copy contact information</span>
              </div>
              <div className="flex items-center">
                <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mr-2">✓</span>
                <span>Update contact status</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any notes about this conversion..."
            />
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
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Converting...' : 'Convert to Patient'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContactToPatientModal



