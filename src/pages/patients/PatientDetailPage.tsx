import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  User,
  FileText,
  Activity,
  Clock,
  Users,
  Heart,
  Pill,
  Shield,
  Stethoscope,
  AlertTriangle,
  Plus,
  Download,
  Eye,
  MessageSquare,
  Video,
  FileImage,
  BarChart3,
  CreditCard,
  Thermometer,
  Weight,
  Ruler,
  X,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { RootState } from '../../store'
import { fetchPatient, deletePatient } from '../../features/patients/patientSlice'
import Button from '../../components/ui/Button'
import ScheduleAppointmentModal from '../../components/appointments/ScheduleAppointmentModal'
import { PatientTimelineEvent, PatientTimelineFilters } from '../../types/patient'

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentPatient, loading, error } = useSelector((state: RootState) => state.patients)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [noteForm, setNoteForm] = useState({
    content: '',
    type: 'general',
    is_provider_visible: false
  })
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [timelineEvents, setTimelineEvents] = useState<PatientTimelineEvent[]>([])
  const [timelineLoading, setTimelineLoading] = useState(false)
  const [timelineFilters, setTimelineFilters] = useState<PatientTimelineFilters>({})

  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(parseInt(id)))
    }
  }, [dispatch, id])

  // Load timeline data when timeline tab is active
  useEffect(() => {
    if (activeTab === 'timeline' && currentPatient) {
      loadTimelineData()
    }
  }, [activeTab, currentPatient])

  const loadTimelineData = async () => {
    if (!currentPatient) return
    
    setTimelineLoading(true)
    try {
      const { patientService } = await import('../../services/patientService')
      const response = await patientService.getPatientTimeline(currentPatient.id, timelineFilters)
      setTimelineEvents(response.timeline)
    } catch (error) {
      console.error('Failed to load timeline data:', error)
    } finally {
      setTimelineLoading(false)
    }
  }

  const handleTimelineFilterChange = (newFilters: Partial<PatientTimelineFilters>) => {
    setTimelineFilters(prev => ({ ...prev, ...newFilters }))
  }

  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
    return `${Math.floor(diffInSeconds / 31536000)} years ago`
  }

  const handleDelete = async () => {
    if (!currentPatient || !window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      await dispatch(deletePatient(currentPatient.id))
      navigate('/patients')
    } catch (error) {
      console.error('Failed to delete patient:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddNote = async () => {
    if (!currentPatient || !noteForm.content.trim()) {
      return
    }

    setIsAddingNote(true)
    try {
      // Import the patientService to add note
      const { patientService } = await import('../../services/patientService')
      await patientService.createPatientNote(currentPatient.id, {
        content: noteForm.content,
        type: noteForm.type,
        is_provider_visible: noteForm.is_provider_visible
      })
      
      // Refresh patient data to show new note
      dispatch(fetchPatient(currentPatient.id))
      
      // Reset form and close modal
      setNoteForm({
        content: '',
        type: 'general',
        is_provider_visible: false
      })
      setShowAddNoteModal(false)
    } catch (error) {
      console.error('Failed to add note:', error)
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleQuickNote = async () => {
    if (!currentPatient || !noteForm.content.trim()) {
      return
    }

    setIsAddingNote(true)
    try {
      const { patientService } = await import('../../services/patientService')
      await patientService.createPatientNote(currentPatient.id, {
        content: noteForm.content,
        type: 'quick',
        is_provider_visible: false
      })
      
      // Refresh patient data
      dispatch(fetchPatient(currentPatient.id))
      
      // Reset form
      setNoteForm({
        content: '',
        type: 'general',
        is_provider_visible: false
      })
    } catch (error) {
      console.error('Failed to add quick note:', error)
    } finally {
      setIsAddingNote(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      non_active: { color: 'bg-red-100 text-red-800', label: 'Inactive' },
      onboarding: { color: 'bg-yellow-100 text-yellow-800', label: 'Onboarding' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      mindbrite: { color: 'bg-blue-100 text-blue-800', label: 'MindBrite' },
      evoke: { color: 'bg-purple-100 text-purple-800', label: 'Evoke' },
      other: { color: 'bg-gray-100 text-gray-800', label: 'Other' },
    }
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.other
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  // Mock data for demonstration - in real app this would come from API
  const mockData = {
    allergies: [
      { allergen: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis' },
      { allergen: 'Latex', severity: 'Moderate', reaction: 'Skin rash' }
    ],
    insurance: {
      primary: { provider: 'Blue Cross Blue Shield', policyNumber: 'BCBS123456', groupNumber: 'GRP789' },
      secondary: { provider: 'Medicare', policyNumber: 'MED456789', groupNumber: 'GRP123' }
    },
    medicalHistory: [
      { condition: 'Hypertension', diagnosed: '2020-03-15', status: 'Active', notes: 'Well controlled with medication' },
      { condition: 'Type 2 Diabetes', diagnosed: '2019-08-22', status: 'Active', notes: 'Diet and exercise management' },
      { condition: 'Appendectomy', diagnosed: '2015-06-10', status: 'Resolved', notes: 'Laparoscopic procedure' }
    ],
    labResults: [
      { test: 'CBC', date: '2025-01-10', status: 'Normal', results: 'All values within normal range' },
      { test: 'Lipid Panel', date: '2025-01-10', status: 'Abnormal', results: 'Cholesterol elevated - 240 mg/dL' },
      { test: 'A1C', date: '2025-01-10', status: 'Normal', results: '6.2% - Good control' }
    ],
    documents: [
      { name: 'Consent Form', type: 'Legal', date: '2025-01-15', size: '245 KB' },
      { name: 'Insurance Card', type: 'Insurance', date: '2025-01-15', size: '1.2 MB' },
      { name: 'Lab Results', type: 'Medical', date: '2025-01-10', size: '856 KB' }
    ]
  }

  // Get latest vital signs
  const latestVitals = currentPatient?.vital_signs?.[0]
  
  // Get active and discontinued medications
  const activeMedications = currentPatient?.medications?.filter(med => med.status === 'active') || []
  const discontinuedMedications = currentPatient?.medications?.filter(med => med.status === 'discontinued') || []

  if (loading.detail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/patients" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !currentPatient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/patients" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Patient Not Found</h1>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">The patient you're looking for could not be found.</p>
          <Link to="/patients">
            <Button>Back to Patients</Button>
          </Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'medical', label: 'Medical History', icon: Stethoscope },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'documents', label: 'Documents', icon: FileImage }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/patients" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentPatient.first_name} {currentPatient.last_name}
            </h1>
            <p className="text-gray-600">Patient ID: {currentPatient.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link to={`/patients/${currentPatient.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentPatient.first_name} {currentPatient.last_name}
                    </p>
                  </div>
                  {currentPatient.date_of_birth && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(currentPatient.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {currentPatient.gender && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Gender</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{currentPatient.gender}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(currentPatient.patient_status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Type</label>
                    <div className="mt-1">{getTypeBadge(currentPatient.patient_type)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Created</label>
                    <p className="mt-1 text-sm text-gray-900 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(currentPatient.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Vital Signs
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Ruler className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{latestVitals?.height}</p>
                    <p className="text-xs text-gray-500">Height</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Weight className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{latestVitals?.weight}</p>
                    <p className="text-xs text-gray-500">Weight</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="h-5 w-5 text-red-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {latestVitals?.blood_pressure_systolic && latestVitals?.blood_pressure_diastolic 
                        ? `${latestVitals.blood_pressure_systolic}/${latestVitals.blood_pressure_diastolic}`
                        : 'N/A'
                      }
                    </p>
                    <p className="text-xs text-gray-500">BP</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{latestVitals?.temperature}</p>
                    <p className="text-xs text-gray-500">Temp</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{latestVitals?.heart_rate}</p>
                    <p className="text-xs text-gray-500">HR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(latestVitals?.updated_at || currentPatient.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {currentPatient.email && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{currentPatient.email}</p>
                      </div>
                    </div>
                  )}
                  {currentPatient.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{currentPatient.phone}</p>
                      </div>
                    </div>
                  )}
                  {(currentPatient.address_line1 || currentPatient.city || currentPatient.state) && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Address</p>
                        <p className="text-sm text-gray-600">
                          {currentPatient.address_line1 && <span>{currentPatient.address_line1}<br /></span>}
                          {currentPatient.address_line2 && <span>{currentPatient.address_line2}<br /></span>}
                          {currentPatient.city && currentPatient.state && (
                            <span>{currentPatient.city}, {currentPatient.state}</span>
                          )}
                          {currentPatient.postal_code && <span> {currentPatient.postal_code}</span>}
                          {currentPatient.country && <span><br />{currentPatient.country}</span>}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Medications */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Pill className="h-5 w-5 mr-2" />
                    Current Medications
                  </h3>
                  <div className="space-y-2">
                    {activeMedications.slice(0, 3).map((medication, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{medication.medication_name}</p>
                          <p className="text-xs text-gray-600">{medication.dosage} • {medication.frequency}</p>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    ))}
                    {activeMedications.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">+{activeMedications.length - 3} more</p>
                    )}
                  </div>
                </div>

                {/* Allergies */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Allergies
                  </h3>
                  <div className="space-y-2">
                    {currentPatient.allergies?.map((allergy, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{allergy.allergen}</p>
                          <p className="text-xs text-gray-600">{allergy.reaction}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          allergy.severity === 'Severe' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {allergy.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Appointments
                  </h3>
                  <div className="space-y-2">
                    {currentPatient.appointments?.filter(apt => apt.status === 'scheduled').slice(0, 2).map((appointment, index) => (
                      <div key={index} className="p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm font-medium text-gray-900 capitalize">{appointment.type}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(appointment.scheduled_at).toLocaleDateString()} at {new Date(appointment.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <p className="text-xs text-gray-500">
                          {appointment.provider ? `with ${appointment.provider.first_name} ${appointment.provider.last_name}` : 'No provider assigned'}
                        </p>
                      </div>
                    ))}
                    {currentPatient.appointments?.filter(apt => apt.status === 'scheduled').length === 0 && (
                      <p className="text-xs text-gray-500 text-center">No upcoming appointments</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {currentPatient.notes && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Notes
                  </h2>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{currentPatient.notes}</p>
                </div>
              )}

              {/* Assigned Staff */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Assigned Staff
                  </h2>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Staff
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPatient.referring_provider && (
                    <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Referring Provider</p>
                        <p className="text-sm text-gray-600">
                          {currentPatient.referring_provider.first_name} {currentPatient.referring_provider.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{currentPatient.referring_provider.email}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  )}
                  {currentPatient.assigned_coach && (
                    <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Assigned Coach</p>
                        <p className="text-sm text-gray-600">
                          {currentPatient.assigned_coach.first_name} {currentPatient.assigned_coach.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{currentPatient.assigned_coach.email}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  )}
                  {!currentPatient.referring_provider && !currentPatient.assigned_coach && (
                    <div className="col-span-2 text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">No staff assigned</p>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Assign Staff Member
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Patient Timeline */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Patient Timeline
                  </h2>
                  <div className="flex items-center space-x-2">
                    <select 
                      className="text-sm border border-gray-300 rounded-md px-3 py-1"
                      value={timelineFilters.type || ''}
                      onChange={(e) => handleTimelineFilterChange({ type: e.target.value as any || undefined })}
                    >
                      <option value="">All Events</option>
                      <option value="appointment">Appointments</option>
                      <option value="note">Notes</option>
                      <option value="file">Files</option>
                      <option value="form">Forms</option>
                      <option value="report">Reports</option>
                    </select>
                    <input 
                      type="date" 
                      className="text-sm border border-gray-300 rounded-md px-3 py-1"
                      placeholder="Start Date"
                      value={timelineFilters.start_date || ''}
                      onChange={(e) => handleTimelineFilterChange({ start_date: e.target.value || undefined })}
                    />
                    <input 
                      type="date" 
                      className="text-sm border border-gray-300 rounded-md px-3 py-1"
                      placeholder="End Date"
                      value={timelineFilters.end_date || ''}
                      onChange={(e) => handleTimelineFilterChange({ end_date: e.target.value || undefined })}
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={loadTimelineData}
                      disabled={timelineLoading}
                    >
                      {timelineLoading ? 'Loading...' : 'Filter'}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Timeline Events */}
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {/* Timeline Events */}
                    <div className="space-y-6">
                      {timelineLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                          <p className="text-gray-500 mt-2">Loading timeline...</p>
                        </div>
                      ) : timelineEvents.length > 0 ? (
                        timelineEvents.map((event) => {
                          const getEventIcon = () => {
                            switch (event.event_type) {
                              case 'appointment':
                                return { icon: Calendar, bgColor: 'bg-blue-100', textColor: 'text-blue-600' }
                              case 'note':
                                return { icon: MessageSquare, bgColor: 'bg-green-100', textColor: 'text-green-600' }
                              case 'file':
                                return { icon: FileImage, bgColor: 'bg-purple-100', textColor: 'text-purple-600' }
                              case 'form':
                                return { icon: FileText, bgColor: 'bg-orange-100', textColor: 'text-orange-600' }
                              case 'report':
                                return { icon: BarChart3, bgColor: 'bg-red-100', textColor: 'text-red-600' }
                              default:
                                return { icon: Clock, bgColor: 'bg-gray-100', textColor: 'text-gray-600' }
                            }
                          }

                          const { icon: EventIcon, bgColor, textColor } = getEventIcon()
                          const eventDate = new Date(event.created_at)
                          const timeAgo = getTimeAgo(eventDate)

                          return (
                            <div key={event.id} className="relative flex items-start">
                              <div className={`flex-shrink-0 w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
                                <EventIcon className={`h-5 w-5 ${textColor}`} />
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                                  <span className="text-xs text-gray-500">{timeAgo}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                <div className="mt-2 flex items-center space-x-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    event.status === 'completed' || event.status === 'published' || event.status === 'scheduled'
                                      ? 'bg-green-100 text-green-800'
                                      : event.status === 'draft' || event.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {event.status}
                                  </span>
                                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                                    <span className="text-xs text-gray-500">
                                      {event.metadata.duration && `Duration: ${event.metadata.duration}`}
                                      {event.metadata.file_size && `Size: ${event.metadata.file_size}`}
                                      {event.metadata.report_type && `Type: ${event.metadata.report_type}`}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-8">
                          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No timeline events found</p>
                          <p className="text-sm text-gray-400 mt-1">Patient activity will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-6">
              {/* Current Medications */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Pill className="h-5 w-5 mr-2" />
                    Current Medications
                  </h2>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </div>
                <div className="space-y-3">
                  {activeMedications.map((medication, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{medication.medication_name}</p>
                        <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  ))}
                  {activeMedications.length === 0 && (
                    <div className="text-center py-8">
                      <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No active medications</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Allergies */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Allergies
                  </h2>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Allergy
                  </Button>
                </div>
                <div className="space-y-3">
                  {currentPatient.allergies?.map((allergy, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <p className="font-medium text-gray-900">{allergy.allergen}</p>
                        <p className="text-sm text-gray-600">{allergy.severity} • {allergy.reaction}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        allergy.severity === 'Severe' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {allergy.severity}
                      </span>
                    </div>
                  ))}
                  {currentPatient.allergies?.length === 0 && (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No allergies recorded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Medical Conditions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Medical Conditions
                  </h2>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Condition
                  </Button>
                </div>
                <div className="space-y-3">
                  {currentPatient.medical_history?.map((condition, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{condition.condition}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          condition.status === 'Active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {condition.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Diagnosed: {new Date(condition.diagnosed).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-700">{condition.notes}</p>
                    </div>
                  ))}
                  {currentPatient.medical_history?.length === 0 && (
                    <div className="text-center py-8">
                      <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No medical conditions recorded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Lab Results */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Lab Results
                  </h2>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Results
                  </Button>
                </div>
                <div className="space-y-3">
                  {currentPatient.lab_results?.map((lab, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{lab.test}</p>
                        <p className="text-sm text-gray-600">{lab.results}</p>
                        <p className="text-xs text-gray-500">{new Date(lab.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lab.status === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lab.status}
                      </span>
                    </div>
                  ))}
                  {currentPatient.lab_results?.length === 0 && (
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No lab results available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {/* Appointment Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{currentPatient.appointments?.length || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Scheduled</p>
                      <p className="text-2xl font-bold text-gray-900">{currentPatient.appointments?.filter(apt => apt.status === 'scheduled').length || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{currentPatient.appointments?.filter(apt => apt.status === 'completed').length || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <XCircle className="h-8 w-8 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">No Show</p>
                      <p className="text-2xl font-bold text-gray-900">{currentPatient.appointments?.filter(apt => apt.status === 'no_show').length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Appointments
                  </h2>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowScheduleModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
                <div className="space-y-3">
                  {currentPatient.appointments?.filter(apt => apt.status === 'scheduled').map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">{new Date(appointment.scheduled_at).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-600">{new Date(appointment.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          <p className="text-xs text-gray-500">{appointment.duration_minutes} min</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{appointment.type}</p>
                          <p className="text-sm text-gray-600">
                            {appointment.provider ? `with ${appointment.provider.first_name} ${appointment.provider.last_name}` : 'No provider assigned'}
                          </p>
                          {appointment.coach && (
                            <p className="text-xs text-gray-500">Coach: {appointment.coach.first_name} {appointment.coach.last_name}</p>
                          )}
                          {appointment.location && (
                            <p className="text-xs text-gray-500">{appointment.location}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                  {currentPatient.appointments?.filter(apt => apt.status === 'scheduled').length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No upcoming appointments</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Appointments */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Appointments
                </h2>
                <div className="space-y-3">
                  {currentPatient.appointments?.filter(apt => ['completed', 'no_show', 'canceled'].includes(apt.status)).slice(0, 5).map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">{new Date(appointment.scheduled_at).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-600">{new Date(appointment.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          <p className="text-xs text-gray-500">{appointment.duration_minutes} min</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{appointment.type}</p>
                          <p className="text-sm text-gray-600">
                            {appointment.provider ? `with ${appointment.provider.first_name} ${appointment.provider.last_name}` : 'No provider assigned'}
                          </p>
                          {appointment.coach && (
                            <p className="text-xs text-gray-500">Coach: {appointment.coach.first_name} {appointment.coach.last_name}</p>
                          )}
                          {appointment.notes && (
                            <p className="text-xs text-gray-500">{appointment.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'no_show' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Notes
                        </Button>
                      </div>
                    </div>
                  ))}
                  {currentPatient.appointments?.filter(apt => ['completed', 'no_show', 'canceled'].includes(apt.status)).length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No recent appointments</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Patient Notes */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Patient Notes
                  </h2>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowAddNoteModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
                <div className="space-y-4">
                  {currentPatient.patient_notes?.map((note, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {note.type || 'General'}
                          </span>
                          {note.is_provider_visible && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Provider Visible
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(note.created_at).toLocaleDateString()} by {note.author?.first_name} {note.author?.last_name}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                  {(!currentPatient.patient_notes || currentPatient.patient_notes.length === 0) && (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No notes available for this patient</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Notes */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Notes</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add a quick note..."
                      value={noteForm.content}
                      onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleQuickNote}
                      disabled={isAddingNote || !noteForm.content.trim()}
                    >
                      {isAddingNote ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insurance' && (
            <div className="space-y-6">
              {/* Primary Insurance */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Primary Insurance
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Provider</label>
                      <p className="mt-1 text-sm text-gray-900">{currentPatient.insurance?.primary?.provider}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Policy Number</label>
                      <p className="mt-1 text-sm text-gray-900">{currentPatient.insurance?.primary?.policy_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Group Number</label>
                      <p className="mt-1 text-sm text-gray-900">{currentPatient.insurance?.primary?.group_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Status</label>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Insurance */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Secondary Insurance
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Provider</label>
                      <p className="mt-1 text-sm text-gray-900">{currentPatient.insurance?.secondary?.provider}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Policy Number</label>
                      <p className="mt-1 text-sm text-gray-900">{currentPatient.insurance?.secondary?.policy_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Group Number</label>
                      <p className="mt-1 text-sm text-gray-900">{currentPatient.insurance?.secondary?.group_number}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Status</label>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Billing Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">${currentPatient.current_balance?.toFixed(2) || '0'}</p>
                      <p className="text-sm text-gray-600">Current Balance</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">${currentPatient.insurance_paid?.toFixed(2) || '0'}</p>
                      <p className="text-sm text-gray-600">Insurance Paid</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">${currentPatient.patient_paid?.toFixed(2) || '0'}</p>
                      <p className="text-sm text-gray-600">Patient Paid</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
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
                  {currentPatient.files?.map((file, index) => (
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
                  {(!currentPatient.files || currentPatient.files.length === 0) && (
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
                    <p className="text-xs text-gray-500 mt-2">{currentPatient.files?.filter(file => file.file_type === 'medical').length || 0} documents</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-green-500 mr-2" />
                      <h3 className="font-medium text-gray-900">Insurance</h3>
                    </div>
                    <p className="text-sm text-gray-600">Insurance cards, policy documents</p>
                    <p className="text-xs text-gray-500 mt-2">{currentPatient.files?.filter(file => file.file_type === 'insurance').length || 0} document</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-purple-500 mr-2" />
                      <h3 className="font-medium text-gray-900">Legal</h3>
                    </div>
                    <p className="text-sm text-gray-600">Consent forms, legal documents</p>
                    <p className="text-xs text-gray-500 mt-2">{currentPatient.files?.filter(file => file.file_type === 'legal').length || 0} document</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Patient Note</h3>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Type
                </label>
                <select
                  value={noteForm.type}
                  onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="general">General</option>
                  <option value="medical">Medical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="progress">Progress</option>
                  <option value="concern">Concern</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Content
                </label>
                <textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your note here..."
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="provider-visible"
                  checked={noteForm.is_provider_visible}
                  onChange={(e) => setNoteForm({ ...noteForm, is_provider_visible: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="provider-visible" className="ml-2 block text-sm text-gray-700">
                  Make visible to provider
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddNoteModal(false)}
                disabled={isAddingNote}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNote}
                disabled={isAddingNote || !noteForm.content.trim()}
              >
                {isAddingNote ? 'Adding...' : 'Add Note'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      <ScheduleAppointmentModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        patientId={currentPatient?.id}
        onSuccess={() => {
          dispatch(fetchPatient(currentPatient?.id || 0))
        }}
      />
    </div>
  )
}

export default PatientDetailPage 