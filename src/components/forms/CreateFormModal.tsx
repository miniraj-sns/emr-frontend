import React, { useState, useEffect } from 'react'
import { X, FileText, Plus } from 'lucide-react'
import { FormTemplate, CreateFormSubmissionRequest } from '../../types/form'
import Button from '../ui/Button'

interface CreateFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  patientId: number
  availableTemplates: FormTemplate[]
}

const CreateFormModal: React.FC<CreateFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  patientId,
  availableTemplates
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTemplate) return

    setLoading(true)
    try {
      const { formService } = await import('../../services/formService')
      await formService.createFormSubmission(patientId, {
        form_template_id: selectedTemplate,
        data: {},
        status: 'draft'
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to create form:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Create New Form
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Form Template
            </label>
            <select
              value={selectedTemplate || ''}
              onChange={(e) => setSelectedTemplate(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!Array.isArray(availableTemplates) || availableTemplates.length === 0}
            >
              <option value="">
                {!Array.isArray(availableTemplates) ? 'Loading templates...' : 
                 availableTemplates.length === 0 ? 'No templates available' : 'Choose a template...'}
              </option>
              {Array.isArray(availableTemplates) && availableTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            {selectedTemplate && (
              <p className="text-sm text-gray-600 mt-2">
                {availableTemplates.find(t => t.id === selectedTemplate)?.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedTemplate || loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Form
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFormModal
