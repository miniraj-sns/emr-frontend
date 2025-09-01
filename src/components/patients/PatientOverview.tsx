import React, { useState, useEffect } from 'react'
import { 
  User, 
  Calendar, 
  Clock, 
  Heart, 
  Pill, 
  AlertTriangle, 
  Users, 
  Plus, 
  MessageSquare, 
  FileText,
  Ruler,
  Weight,
  Activity,
  Thermometer,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'
import patientMasterDataService, { 
  PatientAllergy, 
  PatientMedicalProblem, 
  PatientMedication,
  CreatePatientAllergyRequest,
  CreatePatientMedicalProblemRequest,
  CreatePatientMedicationRequest,
  UpdatePatientAllergyRequest,
  UpdatePatientMedicalProblemRequest,
  UpdatePatientMedicationRequest
} from '../../services/patientMasterDataService'
import prescriptionService, {
  Prescription,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest
} from '../../services/prescriptionService'
import vitalSignsService, {
  VitalSigns,
  CreateVitalSignsRequest,
  UpdateVitalSignsRequest
} from '../../services/vitalSignsService'
import AllergyModal from './AllergyModal'
import MedicalProblemModal from './MedicalProblemModal'
import MedicationModal from './MedicationModal'
import PrescriptionModal from './PrescriptionModal'
import VitalSignsModal from './VitalSignsModal'

interface PatientOverviewProps {
  patient: Patient
}

const PatientOverview: React.FC<PatientOverviewProps> = ({ patient }) => {
  // Patient data states
  const [patientAllergies, setPatientAllergies] = useState<PatientAllergy[]>([])
  const [patientMedicalProblems, setPatientMedicalProblems] = useState<PatientMedicalProblem[]>([])
  const [patientMedications, setPatientMedications] = useState<PatientMedication[]>([])
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([])
  const [patientVitalSigns, setPatientVitalSigns] = useState<VitalSigns[]>([])
  
  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [allergyModal, setAllergyModal] = useState({
    isOpen: false,
    mode: 'add' as 'add' | 'edit',
    allergy: null as PatientAllergy | null
  })

  const [medicalProblemModal, setMedicalProblemModal] = useState({
    isOpen: false,
    mode: 'add' as 'add' | 'edit',
    medicalProblem: null as PatientMedicalProblem | null
  })

  const [medicationModal, setMedicationModal] = useState({
    isOpen: false,
    mode: 'add' as 'add' | 'edit',
    medication: null as PatientMedication | null
  })

  const [prescriptionModal, setPrescriptionModal] = useState({
    isOpen: false,
    mode: 'add' as 'add' | 'edit',
    prescription: null as Prescription | null
  })

  const [vitalSignsModal, setVitalSignsModal] = useState({
    isOpen: false,
    mode: 'add' as 'add' | 'edit',
    vitalSigns: null as VitalSigns | null
  })

  // Load patient data when patient changes
  useEffect(() => {
    if (patient.id) {
      loadPatientData()
    }
  }, [patient.id])

  const loadPatientData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [allergiesRes, medicalProblemsRes, medicationsRes, prescriptionsRes, vitalSignsRes] = await Promise.all([
        patientMasterDataService.getPatientAllergies(patient.id),
        patientMasterDataService.getPatientMedicalProblems(patient.id),
        patientMasterDataService.getPatientMedications(patient.id),
        prescriptionService.getPatientPrescriptions(patient.id),
        vitalSignsService.getPatientVitalSigns(patient.id)
      ])

      setPatientAllergies(allergiesRes.data || [])
      setPatientMedicalProblems(medicalProblemsRes.data || [])
      setPatientMedications(medicationsRes.data || [])
      setPatientPrescriptions(prescriptionsRes.data || [])
      setPatientVitalSigns(vitalSignsRes.vital_signs || [])
    } catch (err) {
      console.error('Error loading patient data:', err)
      setError('Failed to load patient data')
    } finally {
      setLoading(false)
    }
  }

  // Allergy handlers
  const handleAddAllergy = () => {
    setAllergyModal({
      isOpen: true,
      mode: 'add',
      allergy: null
    })
  }

  const handleEditAllergy = (allergy: PatientAllergy) => {
    setAllergyModal({
      isOpen: true,
      mode: 'edit',
      allergy
    })
  }

  const handleSaveAllergy = async (data: CreatePatientAllergyRequest | UpdatePatientAllergyRequest) => {
    try {
      if (allergyModal.mode === 'add') {
        await patientMasterDataService.createPatientAllergy(patient.id, data as CreatePatientAllergyRequest)
      } else {
        await patientMasterDataService.updatePatientAllergy(patient.id, allergyModal.allergy!.id, data as UpdatePatientAllergyRequest)
      }
      await loadPatientData()
    } catch (err) {
      console.error('Error saving allergy:', err)
      throw err
    }
  }

  const handleDeleteAllergy = async (allergyId: number) => {
    if (!confirm('Are you sure you want to delete this allergy?')) return
    
    try {
      await patientMasterDataService.deletePatientAllergy(patient.id, allergyId)
      await loadPatientData()
    } catch (err) {
      console.error('Error deleting allergy:', err)
      setError('Failed to delete allergy')
    }
  }

  const handleToggleAllergyStatus = async (allergyId: number) => {
    try {
      await patientMasterDataService.togglePatientAllergyStatus(patient.id, allergyId)
      await loadPatientData()
    } catch (err) {
      console.error('Error toggling allergy status:', err)
      setError('Failed to update allergy status')
    }
  }

  // Medical Problem handlers
  const handleAddMedicalProblem = () => {
    setMedicalProblemModal({
      isOpen: true,
      mode: 'add',
      medicalProblem: null
    })
  }

  const handleEditMedicalProblem = (medicalProblem: PatientMedicalProblem) => {
    setMedicalProblemModal({
      isOpen: true,
      mode: 'edit',
      medicalProblem
    })
  }

  const handleSaveMedicalProblem = async (data: CreatePatientMedicalProblemRequest | UpdatePatientMedicalProblemRequest) => {
    try {
      if (medicalProblemModal.mode === 'add') {
        await patientMasterDataService.createPatientMedicalProblem(patient.id, data as CreatePatientMedicalProblemRequest)
      } else {
        await patientMasterDataService.updatePatientMedicalProblem(patient.id, medicalProblemModal.medicalProblem!.id, data as UpdatePatientMedicalProblemRequest)
      }
      await loadPatientData()
    } catch (err) {
      console.error('Error saving medical problem:', err)
      throw err
    }
  }

  const handleDeleteMedicalProblem = async (problemId: number) => {
    if (!confirm('Are you sure you want to delete this medical problem?')) return
    
    try {
      await patientMasterDataService.deletePatientMedicalProblem(patient.id, problemId)
      await loadPatientData()
    } catch (err) {
      console.error('Error deleting medical problem:', err)
      setError('Failed to delete medical problem')
    }
  }

  const handleToggleMedicalProblemStatus = async (problemId: number) => {
    try {
      await patientMasterDataService.togglePatientMedicalProblemStatus(patient.id, problemId)
      await loadPatientData()
    } catch (err) {
      console.error('Error toggling medical problem status:', err)
      setError('Failed to update medical problem status')
    }
  }

  // Medication handlers
  const handleAddMedication = () => {
    setMedicationModal({
      isOpen: true,
      mode: 'add',
      medication: null
    })
  }

  const handleEditMedication = (medication: PatientMedication) => {
    setMedicationModal({
      isOpen: true,
      mode: 'edit',
      medication
    })
  }

  const handleSaveMedication = async (data: CreatePatientMedicationRequest | UpdatePatientMedicationRequest) => {
    try {
      if (medicationModal.mode === 'add') {
        await patientMasterDataService.createPatientMedication(patient.id, data as CreatePatientMedicationRequest)
      } else {
        await patientMasterDataService.updatePatientMedication(patient.id, medicationModal.medication!.id, data as UpdatePatientMedicationRequest)
      }
      await loadPatientData()
    } catch (err) {
      console.error('Error saving medication:', err)
      throw err
    }
  }

  const handleDeleteMedication = async (medicationId: number) => {
    if (!confirm('Are you sure you want to delete this medication?')) return
    
    try {
      await patientMasterDataService.deletePatientMedication(patient.id, medicationId)
      await loadPatientData()
    } catch (err) {
      console.error('Error deleting medication:', err)
      setError('Failed to delete medication')
    }
  }

  const handleToggleMedicationStatus = async (medicationId: number) => {
    try {
      await patientMasterDataService.togglePatientMedicationStatus(patient.id, medicationId)
      await loadPatientData()
    } catch (err) {
      console.error('Error toggling medication status:', err)
      setError('Failed to update medication status')
    }
  }

  // Prescription handlers
  const handleAddPrescription = () => {
    setPrescriptionModal({
      isOpen: true,
      mode: 'add',
      prescription: null
    })
  }

  const handleEditPrescription = (prescription: Prescription) => {
    setPrescriptionModal({
      isOpen: true,
      mode: 'edit',
      prescription
    })
  }

  const handleSavePrescription = async (data: CreatePrescriptionRequest | UpdatePrescriptionRequest) => {
    try {
      if (prescriptionModal.mode === 'add') {
        await prescriptionService.createPrescription(patient.id, data as CreatePrescriptionRequest)
      } else {
        await prescriptionService.updatePrescription(patient.id, prescriptionModal.prescription!.id, data as UpdatePrescriptionRequest)
      }
      await loadPatientData()
    } catch (err) {
      console.error('Error saving prescription:', err)
      throw err
    }
  }

  const handleDeletePrescription = async (prescriptionId: number) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return
    
    try {
      await prescriptionService.deletePrescription(patient.id, prescriptionId)
      await loadPatientData()
    } catch (err) {
      console.error('Error deleting prescription:', err)
      setError('Failed to delete prescription')
    }
  }

  const handleTogglePrescriptionStatus = async (prescriptionId: number) => {
    try {
      await prescriptionService.togglePrescriptionStatus(patient.id, prescriptionId)
      await loadPatientData()
    } catch (err) {
      console.error('Error toggling prescription status:', err)
      setError('Failed to update prescription status')
    }
  }

  // Vital Signs handlers
  const handleAddVitalSigns = () => {
    setVitalSignsModal({
      isOpen: true,
      mode: 'add',
      vitalSigns: null
    })
  }

  const handleEditVitalSigns = (vitalSigns: VitalSigns) => {
    setVitalSignsModal({
      isOpen: true,
      mode: 'edit',
      vitalSigns
    })
  }

  const handleSaveVitalSigns = async (data: CreateVitalSignsRequest | UpdateVitalSignsRequest) => {
    try {
      if (vitalSignsModal.mode === 'add') {
        await vitalSignsService.createVitalSigns(patient.id, data as CreateVitalSignsRequest)
      } else {
        await vitalSignsService.updateVitalSigns(patient.id, vitalSignsModal.vitalSigns!.id, data as UpdateVitalSignsRequest)
      }
      await loadPatientData()
    } catch (err) {
      console.error('Error saving vital signs:', err)
      throw err
    }
  }

  const handleDeleteVitalSigns = async (vitalSignsId: number) => {
    if (!confirm('Are you sure you want to delete this vital signs record?')) return
    
    try {
      await vitalSignsService.deleteVitalSigns(patient.id, vitalSignsId)
      await loadPatientData()
    } catch (err) {
      console.error('Error deleting vital signs:', err)
      setError('Failed to delete vital signs record')
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-100 text-yellow-800'
      case 'moderate': return 'bg-orange-100 text-orange-800'
      case 'severe': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'discontinued': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Get latest vital signs
  const latestVitals = patientVitalSigns[0]
  
  // Get active and discontinued medications from patient data
  const activeMedications = patient?.medications?.filter((med: any) => med?.status === 'active') || []
  const discontinuedMedications = patient?.medications?.filter((med: any) => med?.status === 'discontinued') || []

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading patient data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

    <div className="grid grid-cols-1 lg:grid-cols-10 gap-1">
      {/* Column 1 - Patient Info and Assigned Staff (30%) */}
      <div className="space-y-1 lg:col-span-3 bg-blue-50 rounded-lg p-1">
        {/* Basic Information and Contact - Combined */}
        <div className="bg-white rounded-lg p-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Patient Information
          </h2>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Full Name</span>
              <span className="text-sm text-gray-900">{patient.first_name} {patient.last_name}</span>
            </div>
            {patient.date_of_birth && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                <span className="text-sm text-gray-900 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(patient.date_of_birth).toLocaleDateString()}
                </span>
              </div>
            )}
            {patient.gender && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Gender</span>
                <span className="text-sm text-gray-900 capitalize">{patient.gender}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Status</span>
              <div>{getStatusBadge(patient.patient_status)}</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Type</span>
              <div>{getTypeBadge(patient.patient_type)}</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Created</span>
              <span className="text-sm text-gray-900 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(patient.created_at).toLocaleDateString()}
              </span>
            </div>
            {patient.email && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Email</span>
                <span className="text-sm text-gray-900">{patient.email}</span>
              </div>
            )}
            {patient.phone && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Phone</span>
                <span className="text-sm text-gray-900">{patient.phone}</span>
              </div>
            )}
            {(patient.address_line1 || patient.city || patient.state) && (
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-gray-500">Address</span>
                <span className="text-sm text-gray-900 text-right">
                  {patient.address_line1 && <span>{patient.address_line1}<br /></span>}
                  {patient.address_line2 && <span>{patient.address_line2}<br /></span>}
                  {patient.city && patient.state && (
                    <span>{patient.city}, {patient.state}</span>
                  )}
                  {patient.postal_code && <span> {patient.postal_code}</span>}
                  {patient.country && <span> {patient.country}</span>}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Staff */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-md font-semibold text-gray-900 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Assigned Staff
            </h2>
            <Button size="sm" variant="outline" className="h-5 px-1">
              <Plus className="h-3 w-3 mr-1" />
              Assign
            </Button>
          </div>
          <div className="space-y-1">
            {patient.referring_provider && (
              <div className="flex items-center p-1 border border-gray-200 rounded text-sm">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <User className="h-3 w-3 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Referring Provider</p>
                  <p className="text-xs text-gray-600">
                    {patient.referring_provider.first_name} {patient.referring_provider.last_name}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="h-4 px-1">
                  <MessageSquare className="h-3 w-3" />
                </Button>
              </div>
            )}
            {patient.assigned_coach && (
              <div className="flex items-center p-1 border border-gray-200 rounded text-sm">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <User className="h-3 w-3 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Assigned Coach</p>
                  <p className="text-xs text-gray-600">
                    {patient.assigned_coach.first_name} {patient.assigned_coach.last_name}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="h-4 px-1">
                  <MessageSquare className="h-3 w-3" />
                </Button>
              </div>
            )}
            {!patient.referring_provider && !patient.assigned_coach && (
              <div className="text-center py-1">
                <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500 mb-1">No staff assigned</p>
                <Button size="sm" variant="outline" className="h-4 px-1">
                  <Plus className="h-3 w-3 mr-1" />
                  Assign Staff
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {patient.notes && (
          <div className="bg-white rounded-lg p-2">
            <h2 className="text-md font-semibold text-gray-900 mb-1 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">{patient.notes}</p>
          </div>
        )}
      </div>

      {/* Column 2 - Vitals and Appointments (30%) */}
      <div className="space-y-1 lg:col-span-3 bg-orange-50 rounded-lg p-1">
        {/* Vital Signs - Compact */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Vital Signs
            </h2>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-5 px-1"
              onClick={handleAddVitalSigns}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-normal text-gray-500">
              Latest: {latestVitals ? new Date(latestVitals.recorded_at).toLocaleDateString() : 'No data'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1">
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
          
          {/* Vital Signs History */}
          {patientVitalSigns.length > 1 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">History</h3>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {patientVitalSigns.slice(1, 4).map((vitalSigns) => (
                  <div key={vitalSigns.id} className="flex items-center justify-between p-1 bg-gray-50 rounded border border-gray-200 text-xs">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {new Date(vitalSigns.recorded_at).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        BP: {vitalSigns.blood_pressure_systolic && vitalSigns.blood_pressure_diastolic 
                          ? `${vitalSigns.blood_pressure_systolic}/${vitalSigns.blood_pressure_diastolic}` 
                          : 'N/A'} | 
                        Temp: {vitalSigns.temperature || 'N/A'} | 
                        HR: {vitalSigns.heart_rate || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditVitalSigns(vitalSigns)}
                        className="p-0.5 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteVitalSigns(vitalSigns.id)}
                        className="p-0.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {patientVitalSigns.length > 4 && (
                  <p className="text-xs text-gray-500 text-center">+{patientVitalSigns.length - 4} more records</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg p-2">
          <h3 className="text-md font-semibold text-gray-900 mb-1 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Appointments
          </h3>
          <div className="space-y-1">
              {patient.appointments?.filter((apt: any) => apt?.status === 'scheduled').slice(0, 2).map((appointment: any, index: number) => (
              <div key={index} className="p-1 bg-blue-50 rounded border border-blue-200 text-sm">
                  <p className="font-medium text-gray-900 capitalize">{appointment?.type || 'Unknown'}</p>
                <p className="text-xs text-gray-600">
                    {appointment?.scheduled_at ? (
                      <>
                  {new Date(appointment.scheduled_at).toLocaleDateString()} at {new Date(appointment.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </>
                    ) : 'No date set'}
                </p>
                <p className="text-xs text-gray-500">
                    {appointment?.provider ? `with ${appointment.provider.first_name} ${appointment.provider.last_name}` : 'No provider assigned'}
                </p>
              </div>
            ))}
              {(!patient.appointments || patient.appointments.filter((apt: any) => apt?.status === 'scheduled').length === 0) && (
              <p className="text-xs text-gray-500 text-center">No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>

        {/* Column 3 - Medications, Allergies, and Medical Problems (40%) */}
      <div className="space-y-1 lg:col-span-4 bg-purple-50 rounded-lg p-1">
        {/* Current Medications */}
        <div className="bg-white rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-md font-semibold text-gray-900 flex items-center">
            <Pill className="h-4 w-4 mr-2" />
            Current Medications
          </h3>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-5 px-1"
                onClick={handleAddMedication}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
                </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {patientMedications.length > 0 ? (
                patientMedications.slice(0, 3).map((medication) => (
                  <div key={medication.id} className="flex items-center justify-between p-1 bg-gray-50 rounded text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{medication.medication_name || medication.master_medication?.name || 'Unknown Medication'}</p>
                      <p className="text-xs text-gray-600">
                        {medication.dosage && `${medication.dosage}`}
                        {medication.frequency && ` • ${medication.frequency}`}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ${getStatusColor(medication.status)}`}>
                          {medication.status}
                </span>
              </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditMedication(medication)}
                        className="p-0.5 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleToggleMedicationStatus(medication.id)}
                        className={`px-1 py-0.5 text-xs rounded ${medication.is_active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                      >
                        {medication.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteMedication(medication.id)}
                        className="p-0.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-2">No medications recorded</p>
              )}
              {patientMedications.length > 3 && (
                <p className="text-xs text-gray-500 text-center">+{patientMedications.length - 3} more</p>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-md font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            Allergies
          </h3>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-5 px-1"
                onClick={handleAddAllergy}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {patientAllergies.length > 0 ? (
                patientAllergies.slice(0, 3).map((allergy) => (
                  <div key={allergy.id} className="flex items-center justify-between p-1 bg-red-50 rounded border border-red-200 text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{allergy.master_allergy?.name || 'Unknown Allergy'}</p>
                      {allergy.reaction && (
                  <p className="text-xs text-gray-600">{allergy.reaction}</p>
                      )}
                      <div className="flex items-center space-x-1 mt-1">
                        <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(allergy.severity)}`}>
                  {allergy.severity}
                </span>
              </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditAllergy(allergy)}
                        className="p-0.5 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleToggleAllergyStatus(allergy.id)}
                        className={`px-1 py-0.5 text-xs rounded ${allergy.is_active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                      >
                        {allergy.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteAllergy(allergy.id)}
                        className="p-0.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-2">No allergies recorded</p>
              )}
              {patientAllergies.length > 3 && (
                <p className="text-xs text-gray-500 text-center">+{patientAllergies.length - 3} more</p>
              )}
            </div>
          </div>

          {/* Medical Problems */}
          <div className="bg-white rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-md font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                Medical Problems
              </h3>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-5 px-1"
                onClick={handleAddMedicalProblem}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {patientMedicalProblems.length > 0 ? (
                patientMedicalProblems.slice(0, 3).map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between p-1 bg-orange-50 rounded border border-orange-200 text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{problem.master_medical_problem?.name || 'Unknown Problem'}</p>
                      {problem.notes && (
                        <p className="text-xs text-gray-600">{problem.notes}</p>
                      )}
                      <div className="flex items-center space-x-1 mt-1">
                        <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(problem.severity)}`}>
                          {problem.severity}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditMedicalProblem(problem)}
                        className="p-0.5 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleToggleMedicalProblemStatus(problem.id)}
                        className={`px-1 py-0.5 text-xs rounded ${problem.is_active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                      >
                        {problem.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteMedicalProblem(problem.id)}
                        className="p-0.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
              </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center py-2">No medical problems recorded</p>
              )}
              {patientMedicalProblems.length > 3 && (
                <p className="text-xs text-gray-500 text-center">+{patientMedicalProblems.length - 3} more</p>
            )}
          </div>
        </div>

        {/* Prescriptions */}
        <div className="bg-white rounded-lg p-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-md font-semibold text-gray-900 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-green-500" />
              Prescriptions
            </h3>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-5 px-1"
              onClick={handleAddPrescription}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {patientPrescriptions.length > 0 ? (
              patientPrescriptions.slice(0, 3).map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-1 bg-green-50 rounded border border-green-200 text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {prescription.drug_name} - {prescription.quantity} - Qty: {prescription.quantity} - Route: {prescription.route?.name || prescription.route_id} - Interval: {prescription.interval?.name || prescription.interval_id}
                    </p>
                    {prescription.directions && (
                      <p className="text-xs text-gray-600">{prescription.directions}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditPrescription(prescription)}
                      className="p-0.5 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleTogglePrescriptionStatus(prescription.id)}
                      className={`px-1 py-0.5 text-xs rounded ${prescription.is_active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      {prescription.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeletePrescription(prescription.id)}
                      className="p-0.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-2">No prescriptions recorded</p>
            )}
            {patientPrescriptions.length > 3 && (
              <p className="text-xs text-gray-500 text-center">+{patientPrescriptions.length - 3} more</p>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Modals */}
      <AllergyModal
        isOpen={allergyModal.isOpen}
        onClose={() => setAllergyModal({ isOpen: false, mode: 'add', allergy: null })}
        patientId={patient.id}
        allergy={allergyModal.allergy}
        onSave={handleSaveAllergy}
        mode={allergyModal.mode}
      />

      <MedicalProblemModal
        isOpen={medicalProblemModal.isOpen}
        onClose={() => setMedicalProblemModal({ isOpen: false, mode: 'add', medicalProblem: null })}
        patientId={patient.id}
        medicalProblem={medicalProblemModal.medicalProblem}
        onSave={handleSaveMedicalProblem}
        mode={medicalProblemModal.mode}
      />

      <MedicationModal
        isOpen={medicationModal.isOpen}
        onClose={() => setMedicationModal({ isOpen: false, mode: 'add', medication: null })}
        patientId={patient.id}
        medication={medicationModal.medication}
        onSave={handleSaveMedication}
        mode={medicationModal.mode}
      />

      <PrescriptionModal
        isOpen={prescriptionModal.isOpen}
        onClose={() => setPrescriptionModal({ isOpen: false, mode: 'add', prescription: null })}
        patientId={patient.id}
        prescription={prescriptionModal.prescription}
        onSave={handleSavePrescription}
        mode={prescriptionModal.mode}
      />

      <VitalSignsModal
        isOpen={vitalSignsModal.isOpen}
        onClose={() => setVitalSignsModal({ isOpen: false, mode: 'add', vitalSigns: null })}
        patientId={patient.id}
        vitalSigns={vitalSignsModal.vitalSigns}
        onSave={handleSaveVitalSigns}
        mode={vitalSignsModal.mode}
      />
    </div>
  )
}

export default PatientOverview
