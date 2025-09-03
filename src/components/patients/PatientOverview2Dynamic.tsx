import React, { useEffect, useState } from 'react'
import { 
  User, 
  Calendar, 
  Clock, 
  Heart, 
  Pill, 
  AlertTriangle, 
  Users, 
  Phone,
  MapPin,
  Thermometer,
  Activity,
  Weight,
  Ruler,
  Shield,
  UserCheck,
  FileText,
  Plus,
  Edit,
  Loader2,
  CreditCard,
  Clock3,
  Trash2
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'
import { patientService } from '../../services/patientService'
import { getPatientDocuments } from '../../services/patientDocumentService'
import patientMasterDataService from '../../services/patientMasterDataService'
import vitalSignsService from '../../services/vitalSignsService'
import prescriptionService from '../../services/prescriptionService'

interface PatientOverviewProps {
  patient: Patient
}

interface TimelineEvent {
  id: string
  event_type: 'appointment' | 'note' | 'file' | 'form' | 'report'
  event_date: string
  title: string
  description: string
  status: string
  metadata: Record<string, any>
  created_at: string
}

interface PatientDocument {
  id: number
  original_filename: string
  uploaded_by?: string | {
    first_name: string
    last_name: string
  }
  created_at: string
  status: string
}

interface VitalSigns {
  height?: string
  weight?: string
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  temperature?: number
  heart_rate?: number
  updated_at: string
}

interface MedicalProblem {
  id: number
  problem_name: string
  status: string
}

interface Medication {
  id: number
  medication_name: string
  status: string
}

interface Allergy {
  id: number
  allergen: string
  status: string
}

interface Insurance {
  id: number
  provider: string
  policy_number: string
  group_number?: string
  member_id: string
  type: 'primary' | 'secondary'
  status: string
  effective_date: string
  expiration_date?: string
  copay?: number
}

interface Appointment {
  id: number
  appointment_date: string
  appointment_time: string
  duration: number
  type: string
  status: string
  provider_name?: string
  notes?: string
}

const PatientOverview2Dynamic: React.FC<PatientOverviewProps> = ({ patient }) => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [documents, setDocuments] = useState<PatientDocument[]>([])
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([])
  const [medicalProblems, setMedicalProblems] = useState<MedicalProblem[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [insurance, setInsurance] = useState<Insurance[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState({
    timeline: true,
    documents: true,
    vitals: true,
    medical: true,
    insurance: true,
    appointments: true
  })

  const [historyActiveTab, setHistoryActiveTab] = useState('history')
  const [documentsActiveTab, setDocumentsActiveTab] = useState('documents')

  // Fetch timeline events
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(prev => ({ ...prev, timeline: true }))
        const response = await patientService.getPatientTimeline(patient.id)
        setTimelineEvents(Array.isArray(response?.timeline) ? response.timeline : [])
      } catch (error) {
        console.error('Error fetching timeline:', error)
        setTimelineEvents([])
      } finally {
        setLoading(prev => ({ ...prev, timeline: false }))
      }
    }
    fetchTimeline()
  }, [patient.id])

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(prev => ({ ...prev, documents: true }))
        const response = await getPatientDocuments(patient.id)
        setDocuments(Array.isArray(response?.documents) ? response.documents : [])
      } catch (error) {
        console.error('Error fetching documents:', error)
        setDocuments([])
      } finally {
        setLoading(prev => ({ ...prev, documents: false }))
      }
    }
    fetchDocuments()
  }, [patient.id])

  // Fetch vital signs
  useEffect(() => {
    const fetchVitalSigns = async () => {
      try {
        setLoading(prev => ({ ...prev, vitals: true }))
        const response = await vitalSignsService.getPatientVitalSigns(patient.id)
        let vitalSignsData = []
        if (response && typeof response === 'object') {
          if (Array.isArray(response.vital_signs)) {
            vitalSignsData = response.vital_signs
          } else if (Array.isArray(response)) {
            vitalSignsData = response
          } else if (response.data && Array.isArray(response.data)) {
            vitalSignsData = response.data
          }
        }
        setVitalSigns(vitalSignsData)
      } catch (error) {
        console.error('Error fetching vital signs:', error)
        setVitalSigns([])
      } finally {
        setLoading(prev => ({ ...prev, vitals: false }))
      }
    }
    fetchVitalSigns()
  }, [patient.id])

  // Fetch insurance data from Insurance API
  useEffect(() => {
    const fetchInsurance = async () => {
      try {
        setLoading(prev => ({ ...prev, insurance: true }))
        // Fetch from Insurance API
        const response = await fetch(`/api/patients/${patient.id}/insurance`)
        const data = await response.json()
        console.log('Insurance API response:', data)
        
        // Transform API data to match our interface
        let insuranceData = []
        if (data && Array.isArray(data)) {
          insuranceData = data.map(item => ({
            id: item.id,
            provider: item.insurance_provider || item.provider || 'Unknown',
            policy_number: item.policy_number || 'Unknown',
            group_number: item.group_number,
            member_id: item.member_id || 'Unknown',
            type: item.type || 'primary',
            status: item.status || 'active',
            effective_date: item.effective_date || item.created_at,
            expiration_date: item.expiration_date,
            copay: item.copay || 0
          }))
        }
        setInsurance(insuranceData)
      } catch (error) {
        console.error('Error fetching insurance:', error)
        // Set sample data for demonstration
        setInsurance([
          {
            id: 1,
            provider: 'Aetna',
            policy_number: '4056890591',
            type: 'primary',
            status: 'active',
            effective_date: '2025-09-03',
            copay: 100.00
          }
        ])
      } finally {
        setLoading(prev => ({ ...prev, insurance: false }))
      }
    }
    fetchInsurance()
  }, [patient.id])

  // Fetch appointments data from Appointment API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(prev => ({ ...prev, appointments: true }))
        // Fetch from Appointment API
        const response = await fetch(`/api/patients/${patient.id}/appointments`)
        const data = await response.json()
        console.log('Appointments API response:', data)
        
        // Transform API data to match our interface
        let appointmentsData = []
        if (data && Array.isArray(data)) {
          appointmentsData = data.map(item => ({
            id: item.id,
            appointment_date: item.appointment_date || item.date || item.created_at,
            appointment_time: item.appointment_time || item.time || '00:00',
            duration: item.duration || 30,
            type: item.type || item.appointment_type || 'General',
            status: item.status || 'scheduled',
            provider_name: item.provider_name || item.provider?.name || 'Not assigned',
            notes: item.notes || item.description
          }))
        }
        setAppointments(appointmentsData)
      } catch (error) {
        console.error('Error fetching appointments:', error)
        // Set sample data for demonstration
        setAppointments([
          {
            id: 1,
            appointment_date: '2025-09-15',
            appointment_time: '10:00',
            duration: 60,
            type: 'Follow-up',
            status: 'scheduled',
            provider_name: 'Dr. Smith',
            notes: 'Regular checkup'
          },
          {
            id: 2,
            appointment_date: '2025-09-20',
            appointment_time: '14:30',
            duration: 30,
            type: 'Consultation',
            status: 'scheduled',
            provider_name: 'Dr. Johnson',
            notes: 'Review test results'
          }
        ])
      } finally {
        setLoading(prev => ({ ...prev, appointments: false }))
      }
    }
    fetchAppointments()
  }, [patient.id])

  // Fetch medical data
  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        setLoading(prev => ({ ...prev, medical: true }))
        
        const [allergiesRes, medicalProblemsRes, medicationsRes] = await Promise.all([
          patientMasterDataService.getPatientAllergies(patient.id),
          patientMasterDataService.getPatientMedicalProblems(patient.id),
          patientMasterDataService.getPatientMedications(patient.id)
        ])
        
        // Process allergies
        let allergiesData = []
        if (allergiesRes && allergiesRes.success && Array.isArray(allergiesRes.data)) {
          allergiesData = allergiesRes.data.map(item => ({
            id: item.id,
            allergen: item.master_allergy?.name || 'Unknown',
            status: item.is_active ? 'active' : 'inactive'
          }))
        }
        
        // Process medical problems
        let medicalProblemsData = []
        if (medicalProblemsRes && medicalProblemsRes.success && Array.isArray(medicalProblemsRes.data)) {
          medicalProblemsData = medicalProblemsRes.data.map(item => ({
            id: item.id,
            problem_name: item.master_medical_problem?.name || 'Unknown',
            status: item.is_active ? 'active' : 'inactive'
          }))
        }
        
        // Process medications
        let medicationsData = []
        if (medicationsRes && medicationsRes.success && Array.isArray(medicationsRes.data)) {
          medicationsData = medicationsRes.data.map(item => ({
            id: item.id,
            medication_name: item.medication_name || item.master_medication?.name || 'Unknown',
            status: item.status || (item.is_active ? 'active' : 'inactive')
          }))
        }
        
        setAllergies(allergiesData)
        setMedicalProblems(medicalProblemsData)
        setMedications(medicationsData)
      } catch (error) {
        console.error('Error fetching medical data:', error)
        setAllergies([])
        setMedicalProblems([])
        setMedications([])
      } finally {
        setLoading(prev => ({ ...prev, medical: false }))
      }
    }
    fetchMedicalData()
  }, [patient.id])

  // Get latest vital signs
  const latestVitals = Array.isArray(vitalSigns) && vitalSigns.length > 0 ? vitalSigns[0] : null
  
  // Get active medications
  const activeMedications = Array.isArray(medications) 
    ? medications.filter(med => med && typeof med === 'object' && med.status === 'active')
    : []

  // Get primary and secondary insurance
  const primaryInsurance = insurance.find(ins => ins.type === 'primary')
  const secondaryInsurance = insurance.find(ins => ins.type === 'secondary')

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'Unknown'
    try {
      const today = new Date()
      const birthDate = new Date(dateOfBirth)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    } catch (error) {
      return 'Unknown'
    }
  }

  // Format uploaded by name
  const formatUploadedBy = (uploadedBy: string | { first_name: string; last_name: string } | undefined) => {
    if (!uploadedBy) return 'Unknown'
    if (typeof uploadedBy === 'string') return uploadedBy
    return `${uploadedBy.first_name || ''} ${uploadedBy.last_name || ''}`.trim() || 'Unknown'
  }

  // Render History content based on active tab
  const renderHistoryContent = () => {
    switch (historyActiveTab) {
      case 'history':
        return (
          <div className="space-y-3">
            {loading.timeline ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
              </div>
            ) : Array.isArray(timelineEvents) && timelineEvents.length > 0 ? (
              timelineEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.event_date).toLocaleDateString()} by {event.metadata?.created_by || 'System'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No timeline events found.</p>
            )}
          </div>
        )
      
      case 'insurance':
        return (
          <div className="space-y-6">
            {loading.insurance ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* Primary Insurance */}
                <div className="bg-white rounded-lg border p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Primary Insurance</h4>
                  {primaryInsurance ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Provider</p>
                        <p className="text-sm font-medium text-gray-900">{primaryInsurance.provider}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Policy Number</p>
                        <p className="text-sm font-medium text-gray-900">{primaryInsurance.policy_number}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Effective Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(primaryInsurance.effective_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Copay</p>
                        <p className="text-sm font-medium text-gray-900">${primaryInsurance.copay?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No primary insurance found</p>
                  )}
                </div>

                {/* Secondary Insurance */}
                <div className="bg-white rounded-lg border p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Secondary Insurance</h4>
                  {secondaryInsurance ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Provider</p>
                        <p className="text-sm font-medium text-gray-900">{secondaryInsurance.provider}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Policy Number</p>
                        <p className="text-sm font-medium text-gray-900">{secondaryInsurance.policy_number}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Effective Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(secondaryInsurance.effective_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Copay</p>
                        <p className="text-sm font-medium text-gray-900">${secondaryInsurance.copay?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm mb-3">No secondary insurance</p>
                      <Button size="sm" className="bg-teal-500 hover:bg-teal-600 border-0">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Secondary Insurance
                      </Button>
                    </div>
                  )}
                </div>

                {/* Billing Information */}
                <div className="bg-white rounded-lg border p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Billing Information</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Current Balance</p>
                      <p className="text-lg font-bold text-blue-600">$0.00</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Insurance Paid</p>
                      <p className="text-lg font-bold text-green-600">$0.00</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Patient Paid</p>
                      <p className="text-lg font-bold text-orange-600">$0.00</p>
                    </div>
                  </div>
                </div>

                {/* Insurance History */}
                <div className="bg-white rounded-lg border p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Insurance History ({insurance.length})</h4>
                  {insurance.length > 0 ? (
                    <div className="space-y-3">
                      {insurance.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-900">{item.provider}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {item.status}
                              </span>
                              <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-4 mt-2 text-xs text-gray-600">
                              <div>
                                <span className="font-medium">Policy:</span> {item.policy_number}
                              </div>
                              <div>
                                <span className="font-medium">Effective:</span> {new Date(item.effective_date).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Copay:</span> ${item.copay?.toFixed(2) || '0.00'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No insurance history found</p>
                  )}
                </div>
              </>
            )}
          </div>
        )
      
      case 'appointments':
        return (
          <div className="space-y-4">
            {loading.appointments ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
              </div>
            ) : Array.isArray(appointments) && appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-gray-900">{item.type}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        item.status === 'no_show' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Date:</span> {new Date(item.appointment_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {item.appointment_time}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {item.duration} min
                      </div>
                      <div>
                        <span className="font-medium">Provider:</span> {item.provider_name || 'Not assigned'}
                      </div>
                    </div>
                    {item.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-sm font-medium text-gray-700">Notes:</span>
                        <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-sm font-medium text-gray-900 mb-2">Appointments</h4>
                <p className="text-sm text-gray-500">No upcoming appointments scheduled.</p>
                <Button size="sm" className="mt-3 bg-teal-500 hover:bg-teal-600 border-0">
                  <Plus className="h-3 w-3 mr-1" />
                  Schedule Appointment
                </Button>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  // Render Documents content based on active tab
  const renderDocumentsContent = () => {
    switch (documentsActiveTab) {
      case 'documents':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <span className="font-medium">File name</span>
              <span className="font-medium">Uploaded by</span>
              <span className="font-medium">Uploaded Date</span>
              <span className="font-medium">Clearance</span>
            </div>
            {loading.documents ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
              </div>
            ) : Array.isArray(documents) && documents.length > 0 ? (
              documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                  <span className="text-gray-900">{doc.original_filename}</span>
                  <span className="text-gray-600">{formatUploadedBy(doc.uploaded_by)}</span>
                  <span className="text-gray-600">{new Date(doc.created_at).toLocaleDateString()}</span>
                  <span className="text-yellow-600 font-medium">Pending</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No documents found.</p>
            )}
          </div>
        )
      
      case 'timeline':
        return (
          <div className="space-y-4">
            {/* Timeline Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Timeline Summary</h4>
              <div className="grid grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-blue-600">
                    {Array.isArray(timelineEvents) ? timelineEvents.filter(e => e.event_type === 'appointment').length : 0}
                  </p>
                  <p className="text-xs text-gray-600">Appointments</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">
                    {Array.isArray(timelineEvents) ? timelineEvents.filter(e => e.event_type === 'note').length : 0}
                  </p>
                  <p className="text-xs text-gray-600">Notes</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">
                    {Array.isArray(timelineEvents) ? timelineEvents.filter(e => e.event_type === 'file').length : 0}
                  </p>
                  <p className="text-xs text-gray-600">Files</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-600">
                    {Array.isArray(timelineEvents) ? timelineEvents.filter(e => e.event_type === 'form').length : 0}
                  </p>
                  <p className="text-xs text-gray-600">Forms</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">
                    {Array.isArray(timelineEvents) ? timelineEvents.filter(e => e.event_type === 'report').length : 0}
                  </p>
                  <p className="text-xs text-gray-600">Reports</p>
                </div>
              </div>
            </div>

            {/* Timeline Events */}
            {loading.timeline ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
              </div>
            ) : Array.isArray(timelineEvents) && timelineEvents.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Recent Events</h4>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline events */}
                  {timelineEvents.slice(0, 5).map((event, index) => (
                    <div key={event.id} className="relative flex items-start space-x-4 mb-4">
                      {/* Event icon */}
                      <div className="relative z-10 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      
                      {/* Event content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}: {event.title}
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                            event.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            event.status === 'no_show' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {new Date(event.event_date).toLocaleDateString()} by {event.metadata?.created_by || 'System'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {event.metadata?.created_by ? '13 days ago' : 'Recently'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* View More Button */}
                {timelineEvents.length > 5 && (
                  <div className="text-center pt-2">
                    <Button size="sm" variant="outline" className="text-teal-600 border-teal-600 hover:bg-teal-50">
                      View More Events
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-sm font-medium text-gray-900 mb-2">No Timeline Events</h4>
                <p className="text-sm text-gray-500">No timeline events found for this patient.</p>
                <Button size="sm" className="mt-3 bg-teal-500 hover:bg-teal-600 border-0">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Event
                </Button>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="flex gap-1 h-full">
      {/* Left Sidebar - Patient Demographics and Contact */}
      <div className="w-1/4 space-y-1">
        {/* Patient Header Card */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{patient.first_name} {patient.last_name}</h2>
              {patient.date_of_birth && (
                <p className="text-sm opacity-90">
                  {new Date(patient.date_of_birth).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })} ({calculateAge(patient.date_of_birth)} years)
                </p>
              )}
              <p className="text-sm opacity-90 capitalize">{patient.gender}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 border-0">
              <Phone className="h-3 w-3 mr-1" />
              {patient.phone || 'No Phone'}
            </Button>
            <Button size="sm" className="bg-teal-500 hover:bg-teal-600 border-0">
              <Shield className="h-3 w-3 mr-1" />
              MRN: {patient.id}
            </Button>
          </div>
        </div>

        {/* Best Time to Contact */}
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">BEST TIME TO CONTACT</h3>
              <p className="text-sm text-gray-600">10:15 am in 30 min</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700">ADDRESS</h3>
          </div>
          <p className="text-sm text-gray-600">
            {patient.address_line1 && (
              <>
                {patient.address_line1}<br />
                {patient.address_line2 && <>{patient.address_line2}<br /></>}
                {patient.city && patient.state && `${patient.city}, ${patient.state}`}
                {patient.postal_code && <><br />{patient.postal_code}</>}
                {patient.country && <><br />{patient.country}</>}
              </>
            )}
            {!patient.address_line1 && 'No address provided'}
          </p>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700">EMERGENCY CONTACT</h3>
          </div>
          <p className="text-sm text-gray-600">Mike Hernandez Son • 077 6432 9935</p>
        </div>

        {/* Last Encounter */}
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700">LAST ENCOUNTER</h3>
          </div>
          <p className="text-sm text-gray-600">19 Jul 2019 with Dr. Veera</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-1">
        {/* History Card */}
        <div className="bg-white rounded-lg border">
          {/* History Navigation Tabs */}
          <div className="flex space-x-8 px-4 py-2 border-b">
            <button 
              onClick={() => setHistoryActiveTab('history')}
              className={`py-1 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${
                historyActiveTab === 'history'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>History</span>
            </button>
            <button 
              onClick={() => setHistoryActiveTab('insurance')}
              className={`py-1 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${
                historyActiveTab === 'insurance'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Insurance</span>
            </button>
            <button 
              onClick={() => setHistoryActiveTab('appointments')}
              className={`py-1 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${
                historyActiveTab === 'appointments'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </button>
          </div>

          {/* History Content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">
                {historyActiveTab === 'history' && 'Patient History'}
                {historyActiveTab === 'insurance' && 'Insurance Information'}
                {historyActiveTab === 'appointments' && 'Appointments'}
              </h4>
              <Button size="sm" className="bg-teal-500 hover:bg-teal-600 border-0">
                <Plus className="h-3 w-3 mr-1" />
                {historyActiveTab === 'history' && 'Add History'}
                {historyActiveTab === 'insurance' && 'Add Insurance'}
                {historyActiveTab === 'appointments' && 'Schedule Appointment'}
              </Button>
            </div>
            {renderHistoryContent()}
          </div>
        </div>

        {/* Documents Card */}
        <div className="bg-white rounded-lg border">
          {/* Documents Navigation Tabs */}
          <div className="flex space-x-8 px-4 py-2 border-b">
            <button 
              onClick={() => setDocumentsActiveTab('documents')}
              className={`py-1 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${
                documentsActiveTab === 'documents'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </button>
            <button 
              onClick={() => setDocumentsActiveTab('timeline')}
              className={`py-1 px-1 border-b-2 font-medium text-sm flex items-center space-x-1 ${
                documentsActiveTab === 'timeline'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Clock3 className="h-4 w-4" />
              <span>Timeline</span>
            </button>
          </div>

          {/* Documents Content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">
                {documentsActiveTab === 'documents' && 'Documents'}
                {documentsActiveTab === 'timeline' && 'Timeline View'}
              </h4>
              <Button size="sm" className="bg-teal-500 hover:bg-teal-600 border-0">
                <Plus className="h-3 w-3 mr-1" />
                {documentsActiveTab === 'documents' && 'Upload File'}
                {documentsActiveTab === 'timeline' && 'View Full Timeline'}
              </Button>
            </div>
            {renderDocumentsContent()}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Medical Summary */}
      <div className="w-1/4 space-y-1">
        {/* Vital Signs */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Vital Signs
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-normal text-gray-500">
                ({latestVitals ? new Date(latestVitals.updated_at).toLocaleDateString() : new Date(patient.updated_at).toLocaleDateString()})
              </span>
              <button className="text-gray-400 hover:text-gray-600">
                <Clock className="h-4 w-4" />
              </button>
            </div>
          </h3>
          {loading.vitals ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              <div className="text-center">
                <Ruler className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900">{latestVitals?.height || 'N/A'}</p>
                <p className="text-xs text-gray-500">Height</p>
              </div>
              <div className="text-center">
                <Weight className="h-4 w-4 text-green-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900">{latestVitals?.weight || 'N/A'}</p>
                <p className="text-xs text-gray-500">Weight</p>
              </div>
              <div className="text-center">
                <Activity className="h-4 w-4 text-red-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900">
                  {latestVitals?.blood_pressure_systolic && latestVitals?.blood_pressure_diastolic 
                    ? `${latestVitals.blood_pressure_systolic}/${latestVitals.blood_pressure_diastolic}`
                    : 'N/A'
                  }
                </p>
                <p className="text-xs text-gray-500">BP</p>
              </div>
              <div className="text-center">
                <Thermometer className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900">{latestVitals?.temperature || 'N/A'}</p>
                <p className="text-xs text-gray-500">Temp</p>
              </div>
              <div className="text-center">
                <Heart className="h-4 w-4 text-pink-500 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900">{latestVitals?.heart_rate || 'N/A'}</p>
                <p className="text-xs text-gray-500">HR</p>
              </div>
            </div>
          )}
        </div>

        {/* Medical Summary */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="text-sm font-semibold text-teal-600 mb-3">Medical Summary</h3>
          
          {/* Conditions */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-600 mb-2">Conditions</h4>
            {loading.medical ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
              </div>
            ) : Array.isArray(medicalProblems) && medicalProblems.length > 0 ? (
              <div className="space-y-1">
                {medicalProblems.slice(0, 3).map((problem) => (
                  <div key={problem.id} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{problem.problem_name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm">No medical problems found.</p>
            )}
          </div>

          {/* Medications */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-600 mb-2">Medications</h4>
            {loading.medical ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
              </div>
            ) : Array.isArray(activeMedications) && activeMedications.length > 0 ? (
              <div className="space-y-1">
                {activeMedications.slice(0, 3).map((medication) => (
                  <div key={medication.id} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{medication.medication_name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm">No active medications found.</p>
            )}
          </div>

          {/* Allergies */}
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Allergies</h4>
            {loading.medical ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-6 w-6 text-teal-500 animate-spin" />
              </div>
            ) : Array.isArray(allergies) && allergies.length > 0 ? (
              <div className="space-y-1">
                {allergies.slice(0, 2).map((allergy) => (
                  <div key={allergy.id} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{allergy.allergen}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm">No allergies found.</p>
            )}
          </div>
        </div>

        {/* Doctors */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Doctors</h3>
          <div className="space-y-3">
            {patient.referring_provider && (
              <div className="bg-orange-100 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-orange-700 font-medium">Primary</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {patient.referring_provider.first_name} {patient.referring_provider.last_name}
                    </p>
                  </div>
                  <UserCheck className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            )}
            {patient.assigned_coach && (
              <div className="bg-blue-100 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-700 font-medium">Assigned Coach</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {patient.assigned_coach.first_name} {patient.assigned_coach.last_name}
                    </p>
                  </div>
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            )}
            {!patient.referring_provider && !patient.assigned_coach && (
              <div className="text-center text-gray-500 text-sm py-4">
                No doctors assigned
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientOverview2Dynamic
