import React from 'react'
import { 
  FileImage, 
  FileText, 
  Shield, 
  Plus, 
  Eye, 
  Download 
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'

interface PatientDocumentsProps {
  patient: Patient
}

const PatientDocuments: React.FC<PatientDocumentsProps> = ({ patient }) => {
  return (
    <div className="space-y-6">
      {/* Document List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileImage className="h-5 w-5 mr-2" />
            Documents & Files
          </h2>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
        <div className="space-y-3">
          {patient.files?.map((file: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded">
                  <FileImage className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.filename}</p>
                  <p className="text-sm text-gray-600">{file.file_type} • {file.file_size} • {new Date(file.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
          {(!patient.files || patient.files.length === 0) && (
            <div className="text-center py-8">
              <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Document Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium text-gray-900">Medical Records</h3>
            </div>
            <p className="text-sm text-gray-600">Lab results, test reports, medical notes</p>
            <p className="text-xs text-gray-500 mt-2">{patient.files?.filter((file: any) => file.file_type === 'medical').length || 0} documents</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="font-medium text-gray-900">Insurance</h3>
            </div>
            <p className="text-sm text-gray-600">Insurance cards, policy documents</p>
            <p className="text-xs text-gray-500 mt-2">{patient.files?.filter((file: any) => file.file_type === 'insurance').length || 0} document</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="font-medium text-gray-900">Legal</h3>
            </div>
            <p className="text-sm text-gray-600">Consent forms, legal documents</p>
            <p className="text-xs text-gray-500 mt-2">{patient.files?.filter((file: any) => file.file_type === 'legal').length || 0} document</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDocuments
