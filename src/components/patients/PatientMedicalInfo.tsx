import React, { useState, useEffect } from 'react'
import { 
  Pill, 
  AlertTriangle, 
  Stethoscope, 
  Plus,
  Edit,
  Trash2,
  Activity,
  Heart,
  Brain,
  Eye,
  Ear,
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
import MedicalProblemModal from './MedicalProblemModal'
import AllergyModal from './AllergyModal'
import MedicationModal from './MedicationModal'

interface PatientMedicalInfoProps {
  patient: Patient
  onMedicalInfoUpdated: () => void
}

const PatientMedicalInfo: React.FC<PatientMedicalInfoProps> = ({ patient, onMedicalInfoUpdated }) => {
  // Data states
  const [patientAllergies, setPatientAllergies] = useState<PatientAllergy[]>([])
  const [patientMedicalProblems, setPatientMedicalProblems] = useState<PatientMedicalProblem[]>([])
  const [patientMedications, setPatientMedications] = useState<PatientMedication[]>([])
  
  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [showMedicalProblemModal, setShowMedicalProblemModal] = useState(false)
  const [showAllergyModal, setShowAllergyModal] = useState(false)
  const [showMedicationModal, setShowMedicationModal] = useState(false)
  const [selectedMedicalProblem, setSelectedMedicalProblem] = useState<PatientMedicalProblem | null>(null)
  const [selectedAllergy, setSelectedAllergy] = useState<PatientAllergy | null>(null)
  const [selectedMedication, setSelectedMedication] = useState<PatientMedication | null>(null)

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
      const [allergiesRes, medicalProblemsRes, medicationsRes] = await Promise.all([
        patientMasterDataService.getPatientAllergies(patient.id),
        patientMasterDataService.getPatientMedicalProblems(patient.id),
        patientMasterDataService.getPatientMedications(patient.id)
      ])

      setPatientAllergies(allergiesRes.data || [])
      setPatientMedicalProblems(medicalProblemsRes.data || [])
      setPatientMedications(medicationsRes.data || [])
    } catch (err) {
      console.error('Error loading patient data:', err)
      setError('Failed to load patient data')
    } finally {
      setLoading(false)
    }
  }

  // Get active and discontinued medications
  const activeMedications = patientMedications.filter((med) => med.status === 'active')
  const discontinuedMedications = patientMedications.filter((med) => med.status === 'discontinued')

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
        return 'bg-red-100 text-red-800'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800'
      case 'mild':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-red-100 text-red-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'chronic':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMedicalIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'cardiovascular':
        return <Heart className="h-4 w-4" />
      case 'neurological':
        return <Brain className="h-4 w-4" />
      case 'respiratory':
        return <Activity className="h-4 w-4" />
      case 'ophthalmology':
        return <Eye className="h-4 w-4" />
      case 'otolaryngology':
        return <Ear className="h-4 w-4" />
      case 'dental':
        return <Stethoscope className="h-4 w-4" />
      default:
        return <Stethoscope className="h-4 w-4" />
    }
  }

  const handleAddMedicalProblem = () => {
    setSelectedMedicalProblem(null)
    setShowMedicalProblemModal(true)
  }

  const handleEditMedicalProblem = (problem: any) => {
    setSelectedMedicalProblem(problem)
    setShowMedicalProblemModal(true)
  }

  const handleAddAllergy = () => {
    setSelectedAllergy(null)
    setShowAllergyModal(true)
  }

  const handleEditAllergy = (allergy: any) => {
    setSelectedAllergy(allergy)
    setShowAllergyModal(true)
  }

  const handleAddMedication = () => {
    setSelectedMedication(null)
    setShowMedicationModal(true)
  }

  const handleEditMedication = (medication: any) => {
    setSelectedMedication(medication)
    setShowMedicationModal(true)
  }

  const handleModalClose = () => {
    setShowMedicalProblemModal(false)
    setShowAllergyModal(false)
    setShowMedicationModal(false)
    setSelectedMedicalProblem(null)
    setSelectedAllergy(null)
    setSelectedMedication(null)
  }

  // Save handlers
  const handleSaveMedicalProblem = async (data: CreatePatientMedicalProblemRequest | UpdatePatientMedicalProblemRequest) => {
    try {
      if (selectedMedicalProblem) {
        await patientMasterDataService.updatePatientMedicalProblem(patient.id, selectedMedicalProblem.id, data as UpdatePatientMedicalProblemRequest)
      } else {
        await patientMasterDataService.createPatientMedicalProblem(patient.id, data as CreatePatientMedicalProblemRequest)
      }
      await loadPatientData()
      handleModalClose()
      onMedicalInfoUpdated()
    } catch (err) {
      console.error('Error saving medical problem:', err)
      throw err
    }
  }

  const handleSaveAllergy = async (data: CreatePatientAllergyRequest | UpdatePatientAllergyRequest) => {
    try {
      if (selectedAllergy) {
        await patientMasterDataService.updatePatientAllergy(patient.id, selectedAllergy.id, data as UpdatePatientAllergyRequest)
      } else {
        await patientMasterDataService.createPatientAllergy(patient.id, data as CreatePatientAllergyRequest)
      }
      await loadPatientData()
      handleModalClose()
      onMedicalInfoUpdated()
    } catch (err) {
      console.error('Error saving allergy:', err)
      throw err
    }
  }

  const handleSaveMedication = async (data: CreatePatientMedicationRequest | UpdatePatientMedicationRequest) => {
    try {
      if (selectedMedication) {
        await patientMasterDataService.updatePatientMedication(patient.id, selectedMedication.id, data as UpdatePatientMedicationRequest)
      } else {
        await patientMasterDataService.createPatientMedication(patient.id, data as CreatePatientMedicationRequest)
      }
      await loadPatientData()
      handleModalClose()
      onMedicalInfoUpdated()
    } catch (err) {
      console.error('Error saving medication:', err)
      throw err
    }
  }

  const handleDiscontinueMedication = async (medication: PatientMedication) => {
    if (!confirm('Are you sure you want to discontinue this medication?')) {
      return
    }

    try {
      await patientMasterDataService.updatePatientMedication(patient.id, medication.id, {
        status: 'discontinued',
        end_date: new Date().toISOString().split('T')[0]
      } as UpdatePatientMedicationRequest)
      await loadPatientData()
      onMedicalInfoUpdated()
    } catch (err) {
      console.error('Error discontinuing medication:', err)
      setError('Failed to discontinue medication')
    }
  }

  const handleDeleteMedication = async (medication: PatientMedication) => {
    if (!confirm('Are you sure you want to delete this medication? This action cannot be undone.')) {
      return
    }

    try {
      await patientMasterDataService.deletePatientMedication(patient.id, medication.id)
      await loadPatientData()
      onMedicalInfoUpdated()
    } catch (err) {
      console.error('Error deleting medication:', err)
      setError('Failed to delete medication')
    }
  }

  const handleDeleteMedicalProblem = async (problem: PatientMedicalProblem) => {
    if (!confirm('Are you sure you want to delete this medical problem? This action cannot be undone.')) {
      return
    }

    try {
      await patientMasterDataService.deletePatientMedicalProblem(patient.id, problem.id)
      await loadPatientData()
      onMedicalInfoUpdated()
    } catch (err) {
      console.error('Error deleting medical problem:', err)
      setError('Failed to delete medical problem')
    }
  }

  const handleDeleteAllergy = async (allergy: PatientAllergy) => {
    if (!confirm('Are you sure you want to delete this allergy? This action cannot be undone.')) {
      return
    }

    try {
      await patientMasterDataService.deletePatientAllergy(patient.id, allergy.id)
      await loadPatientData()
      onMedicalInfoUpdated()
    } catch (err) {
      console.error('Error deleting allergy:', err)
      setError('Failed to delete allergy')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading medical information...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center py-6">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={loadPatientData}
              className="mt-3"
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Medical Problems */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center">
            <Stethoscope className="h-4 w-4 mr-2" />
            Medical Problems ({patientMedicalProblems.length})
          </h2>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleAddMedicalProblem}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {patientMedicalProblems.map((problem: PatientMedicalProblem, index: number) => (
            <div key={index} className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getMedicalIcon(problem.master_medical_problem?.category || '')}
                  <h3 className="font-medium text-gray-900 text-sm">{problem.master_medical_problem?.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(problem.is_active ? 'active' : 'resolved')}`}>
                    {problem.is_active ? 'Active' : 'Resolved'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditMedicalProblem(problem)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleDeleteMedicalProblem(problem)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Category:</span> {problem.master_medical_problem?.category || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Diagnosed:</span> {problem.diagnosis_date ? new Date(problem.diagnosis_date).toLocaleDateString() : 'Not specified'}
                </div>
              </div>
              {problem.notes && (
                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-medium">Notes:</span> {problem.notes}
                </div>
              )}
            </div>
          ))}
          {patientMedicalProblems.length === 0 && (
            <div className="text-center py-6">
              <Stethoscope className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No medical problems recorded</p>
            </div>
          )}
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            Allergies ({patientAllergies.length})
          </h2>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleAddAllergy}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {patientAllergies.map((allergy: PatientAllergy, index: number) => (
            <div key={index} className="border border-red-200 rounded-md p-3 bg-red-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 text-sm">{allergy.master_allergy?.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(allergy.severity)}`}>
                    {allergy.severity}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditAllergy(allergy)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleDeleteAllergy(allergy)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Category:</span> {allergy.master_allergy?.category || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Reaction:</span> {allergy.reaction || 'Not specified'}
                </div>
              </div>
              {allergy.notes && (
                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-medium">Notes:</span> {allergy.notes}
                </div>
              )}
            </div>
          ))}
          {patientAllergies.length === 0 && (
            <div className="text-center py-6">
              <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No allergies recorded</p>
            </div>
          )}
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center">
            <Pill className="h-4 w-4 mr-2" />
            Current Medications ({activeMedications.length})
          </h2>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleAddMedication}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {activeMedications.map((medication: PatientMedication, index: number) => (
            <div key={index} className="border border-green-200 rounded-md p-3 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 text-sm">{medication.medication_name}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditMedication(medication)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleDiscontinueMedication(medication)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Dosage:</span> {medication.dosage}
                </div>
                <div>
                  <span className="font-medium">Frequency:</span> {medication.frequency}
                </div>
                <div>
                  <span className="font-medium">Started:</span> {medication.start_date ? new Date(medication.start_date).toLocaleDateString() : 'Not specified'}
                </div>
              </div>
              {medication.instructions && (
                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-medium">Instructions:</span> {medication.instructions}
                </div>
              )}
            </div>
          ))}
          {activeMedications.length === 0 && (
            <div className="text-center py-6">
              <Pill className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No active medications</p>
            </div>
          )}
        </div>
      </div>

      {/* Medication History */}
      {discontinuedMedications.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <Pill className="h-4 w-4 mr-2" />
            Medication History ({discontinuedMedications.length})
          </h2>
          <div className="space-y-2">
            {discontinuedMedications.slice(0, 3).map((medication: PatientMedication, index: number) => (
              <div key={index} className="border border-gray-200 rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 text-sm">{medication.medication_name}</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Discontinued
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {medication.discontinued_date ? new Date(medication.discontinued_date).toLocaleDateString() : 'Not specified'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Dosage:</span> {medication.dosage || 'Not specified'}
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span> {medication.frequency || 'Not specified'}
                  </div>
                  <div>
                    <span className="font-medium">Started:</span> {medication.start_date ? new Date(medication.start_date).toLocaleDateString() : 'Not specified'}
                  </div>
                </div>
                {medication.discontinuation_reason && (
                  <div className="mt-2 text-xs text-gray-600">
                    <span className="font-medium">Reason:</span> {medication.discontinuation_reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <MedicalProblemModal
        isOpen={showMedicalProblemModal}
        onClose={handleModalClose}
        patientId={patient.id}
        medicalProblem={selectedMedicalProblem}
        mode={selectedMedicalProblem ? 'edit' : 'add'}
        onSave={handleSaveMedicalProblem}
      />

      <AllergyModal
        isOpen={showAllergyModal}
        onClose={handleModalClose}
        patientId={patient.id}
        allergy={selectedAllergy}
        mode={selectedAllergy ? 'edit' : 'add'}
        onSave={handleSaveAllergy}
      />

      <MedicationModal
        isOpen={showMedicationModal}
        onClose={handleModalClose}
        patientId={patient.id}
        medication={selectedMedication}
        mode={selectedMedication ? 'edit' : 'add'}
        onSave={handleSaveMedication}
      />
    </div>
  )
}

export default PatientMedicalInfo
