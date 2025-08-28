import React from 'react'
import { X, FileText, Calendar, User, Download } from 'lucide-react'
import { FormSubmission } from '../../types/form'
import Button from '../ui/Button'

interface FormViewerModalProps {
  isOpen: boolean
  onClose: () => void
  form: FormSubmission | null
}

const FormViewerModal: React.FC<FormViewerModalProps> = ({
  isOpen,
  onClose,
  form
}) => {
  if (!isOpen || !form) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      submitted: { color: 'bg-blue-100 text-blue-800', label: 'Submitted' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const renderFormData = (data: Record<string, any>) => {
    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="border-b border-gray-200 py-3">
        <dt className="text-sm font-medium text-gray-700 capitalize">
          {key.replace(/_/g, ' ')}
        </dt>
        <dd className="mt-1 text-sm text-gray-900">
          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
        </dd>
      </div>
    ))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {form.form_template?.name || 'Form Details'}
                </h3>
                <p className="text-sm text-gray-600">
                  Form submission details
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Form Information */}
          <div className="mb-8">
            <h4 className="text-md font-medium text-gray-900 mb-4">Form Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Template</p>
                  <p className="text-sm text-gray-900">{form.form_template?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Submitted By</p>
                  <p className="text-sm text-gray-900">
                    {form.submitted_by?.first_name} {form.submitted_by?.last_name}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Created</p>
                  <p className="text-sm text-gray-900">{formatDate(form.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-4 w-4"></div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <div className="mt-1">{getStatusBadge(form.status)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Data */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Form Data</h4>
            {Object.keys(form.data).length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="space-y-0">
                  {renderFormData(form.data)}
                </dl>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No form data available</p>
              </div>
            )}
          </div>

          {/* Metadata */}
          {form.metadata && Object.keys(form.metadata).length > 0 && (
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-900 mb-4">Additional Information</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <dl className="space-y-0">
                  {renderFormData(form.metadata)}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormViewerModal
