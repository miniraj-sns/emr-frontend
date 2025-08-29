import React from 'react'
import { 
  Pill, 
  AlertTriangle, 
  Stethoscope, 
  BarChart3, 
  Plus 
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'

interface PatientMedicalHistoryProps {
  patient: Patient
}

const PatientMedicalHistory: React.FC<PatientMedicalHistoryProps> = ({ patient }) => {
  // Get active and discontinued medications
  const activeMedications = patient?.medications?.filter((med: any) => med.status === 'active') || []
  const discontinuedMedications = patient?.medications?.filter((med: any) => med.status === 'discontinued') || []

  return (
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
          {activeMedications.map((medication: any, index: number) => (
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
          {patient.allergies?.map((allergy: any, index: number) => (
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
          {patient.allergies?.length === 0 && (
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
          {patient.medical_history?.map((condition: any, index: number) => (
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
          {patient.medical_history?.length === 0 && (
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
          {patient.lab_results?.map((lab: any, index: number) => (
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
          {patient.lab_results?.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No lab results available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientMedicalHistory
