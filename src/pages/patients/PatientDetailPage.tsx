import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Clock,
  MessageSquare,
  FileImage,
  Shield,
  Pill,
  Stethoscope,
  Activity,
  DollarSign
} from 'lucide-react'
import { RootState } from '../../store'
import { fetchPatient, deletePatient } from '../../features/patients/patientSlice'
import Button from '../../components/ui/Button'
import {
  PatientOverview,
  PatientOverview2Dynamic,
  PatientTimeline,
  PatientMedicalHistory,
  PatientAppointments,
  PatientNotes,
  PatientInsurance,
  PatientDocuments,
  PatientPrescriptions,
  PatientVitalSigns,
  PatientBilling
} from '../../components/patients'
import PatientMedicalInfo from '../../components/patients/PatientMedicalInfo'

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentPatient, loading, error } = useSelector((state: RootState) => state.patients)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(parseInt(id)))
    }
  }, [dispatch, id])

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
    { id: 'overview2', label: 'Overview 2', icon: User },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'medical', label: 'Medical Info', icon: Stethoscope },
    { id: 'vitals', label: 'Vital Signs', icon: Activity },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileImage }
  ]

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="space-y-1">
        {/* First Row - Patient Name and Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/patients" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {currentPatient.first_name} {currentPatient.last_name}
                <span className="text-sm text-gray-600 ms-4">Patient ID: {currentPatient.id}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Link to={`/patients/${currentPatient.id}/edit`}>
              <Button variant="outline" size="sm" className="h-6">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-6 text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
        
        {/* Second Row - Tabs */}
        <div className="bg-white rounded-lg shadow">
          <nav className="flex space-x-3 px-3 py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-1 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${
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
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-1">
          {activeTab === 'overview' && (
            <PatientOverview patient={currentPatient} />
          )}
          {activeTab === 'overview2' && (
            <PatientOverview2Dynamic patient={currentPatient} />
          )}

          {activeTab === 'timeline' && (
            <PatientTimeline patientId={currentPatient.id} />
          )}

          {activeTab === 'medical' && (
            <PatientMedicalInfo 
              patient={currentPatient} 
              onMedicalInfoUpdated={() => dispatch(fetchPatient(currentPatient.id))}
            />
          )}

          {activeTab === 'vitals' && (
            <PatientVitalSigns 
              patient={currentPatient} 
              onVitalSignsUpdated={() => dispatch(fetchPatient(currentPatient.id))}
            />
          )}

          {activeTab === 'appointments' && (
            <PatientAppointments 
              patient={currentPatient} 
              onAppointmentCreated={() => dispatch(fetchPatient(currentPatient.id))}
            />
          )}

          {activeTab === 'prescriptions' && (
            <PatientPrescriptions 
              patient={currentPatient} 
              onPrescriptionUpdated={() => dispatch(fetchPatient(currentPatient.id))}
            />
          )}

          {activeTab === 'notes' && (
            <PatientNotes 
              patient={currentPatient} 
              onNoteAdded={() => dispatch(fetchPatient(currentPatient.id))}
            />
          )}

          {activeTab === 'insurance' && (
            <PatientInsurance 
              patient={currentPatient} 
              onInsuranceUpdated={() => dispatch(fetchPatient(currentPatient.id))}
            />
          )}

          {activeTab === 'billing' && (
            <PatientBilling 
              patient={currentPatient} 
              onBillingUpdated={() => dispatch(fetchPatient(currentPatient.id))}
            />
          )}

          {activeTab === 'documents' && (
            <PatientDocuments patient={currentPatient} />
          )}
        </div>
      </div>


    </div>
  )
}

export default PatientDetailPage 