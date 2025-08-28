import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Edit,
  Download,
  ArrowLeft
} from 'lucide-react'
import { RootState } from '../../store'
import { 
  FormTemplate, 
  FormSubmission, 
  PatientFormsResponse, 
  FormFilters 
} from '../../types/form'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import CreateFormModal from '../../components/forms/CreateFormModal'

const PatientFormsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.auth)
  const { patients } = useSelector((state: RootState) => state.patients)
  
  const [loading, setLoading] = useState(false)
  const [formsData, setFormsData] = useState<PatientFormsResponse | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null)
  const [filters, setFilters] = useState<FormFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [availableTemplates, setAvailableTemplates] = useState<FormTemplate[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(false)

  // Load form templates on component mount
  useEffect(() => {
    loadFormTemplates()
  }, [])

  // Load form data
  useEffect(() => {
    if (selectedPatient) {
      loadPatientForms()
    }
  }, [selectedPatient, filters])

  const loadPatientForms = async () => {
    if (!selectedPatient) return
    
    setLoading(true)
    try {
      const { formService } = await import('../../services/formService')
      const data = await formService.getPatientForms(selectedPatient, filters)
      setFormsData(data)
    } catch (error) {
      console.error('Failed to load patient forms:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFormTemplates = async () => {
    setTemplatesLoading(true)
    try {
      const { formService } = await import('../../services/formService')
      const templates = await formService.getFormTemplates()
      console.log('Loaded templates:', templates)
      // Ensure templates is always an array
      setAvailableTemplates(Array.isArray(templates) ? templates : [])
    } catch (error) {
      console.error('Failed to load form templates:', error)
      // Set empty array on error to prevent crashes
      setAvailableTemplates([])
    } finally {
      setTemplatesLoading(false)
    }
  }

  const handleFilterChange = (newFilters: Partial<FormFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      submitted: { color: 'bg-blue-100 text-blue-800', icon: FileText },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleCreateForm = () => {
    if (!Array.isArray(availableTemplates) || availableTemplates.length === 0) {
      alert('No form templates available. Please try again later.')
      return
    }
    setShowCreateModal(true)
  }

  const handleFormCreated = () => {
    loadPatientForms()
    // Refresh templates in case new ones were added
    loadFormTemplates()
  }

  if (!selectedPatient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/patients" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Patient Forms</h1>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-6">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
            <p className="text-gray-600">
              Please select a patient to view their forms.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Patient
              </label>
              <select
                value={selectedPatient || ''}
                onChange={(e) => setSelectedPatient(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a patient...</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} (ID: {patient.id})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <Button
                onClick={() => navigate('/patients')}
                variant="outline"
              >
                <User className="h-4 w-4 mr-2" />
                Browse All Patients
              </Button>
              
              {selectedPatient && (
                <Button
                  onClick={() => loadPatientForms()}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'View Forms'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/patients" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Forms</h1>
            {formsData ? (
              <p className="text-gray-600">Forms for {formsData.patient_name}</p>
            ) : selectedPatient ? (
              <div className="flex items-center space-x-2">
                <p className="text-gray-600">Selected Patient:</p>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value ? parseInt(e.target.value) : null)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        </div>
        <Button 
          onClick={handleCreateForm}
          disabled={templatesLoading || !Array.isArray(availableTemplates) || availableTemplates.length === 0}
        >
          {templatesLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </>
          )}
        </Button>
      </div>

      {/* Statistics Cards */}
      {formsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">{formsData.statistics.draft}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-gray-900">{formsData.statistics.submitted}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{formsData.statistics.approved}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{formsData.statistics.rejected}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forms List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              {formsData?.total_forms || 0} forms total
            </div>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading forms...</p>
            </div>
          ) : formsData?.forms.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
              <p className="text-gray-600 mb-4">
                This patient has no forms yet. Create their first form to get started.
              </p>
              <Button onClick={handleCreateForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Form
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {formsData?.forms.map(form => (
                <div key={form.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {form.form_template?.name || 'Unknown Form'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Submitted on {formatDate(form.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(form.status)}
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateModal && (
        <CreateFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleFormCreated}
          patientId={selectedPatient}
          availableTemplates={availableTemplates}
        />
      )}
    </div>
  )
}

export default PatientFormsPage
