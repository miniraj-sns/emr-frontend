import React, { useState } from 'react'
import { 
  Pill, 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'

interface PatientPrescriptionsProps {
  patient: Patient
  onPrescriptionUpdated: () => void
}

const PatientPrescriptions: React.FC<PatientPrescriptionsProps> = ({ patient, onPrescriptionUpdated }) => {
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false)

  // Get active and discontinued prescriptions
  const activePrescriptions = patient?.medications?.filter((med: any) => med.status === 'active') || []
  const discontinuedPrescriptions = patient?.medications?.filter((med: any) => med.status === 'discontinued') || []
  const pendingPrescriptions = patient?.medications?.filter((med: any) => med.status === 'pending') || []

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      discontinued: { color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      expired: { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Prescription Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Pill className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{patient.medications?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activePrescriptions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingPrescriptions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Discontinued</p>
              <p className="text-2xl font-bold text-gray-900">{discontinuedPrescriptions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Prescriptions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Pill className="h-5 w-5 mr-2" />
            Active Prescriptions
          </h2>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowAddPrescriptionModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Prescription
          </Button>
        </div>
        <div className="space-y-3">
          {activePrescriptions.map((prescription: any, index: number) => (
            <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{prescription.medication_name}</h3>
                  {getStatusBadge(prescription.status)}
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Discontinue
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Dosage:</span>
                  <span className="ml-2 text-gray-900">{prescription.dosage}</span>
                </div>
                <div>
                  <span className="text-gray-500">Frequency:</span>
                  <span className="ml-2 text-gray-900">{prescription.frequency}</span>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <span className="ml-2 text-gray-900">{prescription.duration || 'Ongoing'}</span>
                </div>
              </div>
              {prescription.instructions && (
                <div className="mt-2">
                  <span className="text-gray-500 text-sm">Instructions:</span>
                  <p className="text-sm text-gray-700 mt-1">{prescription.instructions}</p>
                </div>
              )}
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Prescribed: {new Date(prescription.prescribed_date).toLocaleDateString()}</span>
                  {prescription.prescribing_provider && (
                    <span>by Dr. {prescription.prescribing_provider.first_name} {prescription.prescribing_provider.last_name}</span>
                  )}
                </div>
                {prescription.refills_remaining !== undefined && (
                  <span>Refills: {prescription.refills_remaining}</span>
                )}
              </div>
            </div>
          ))}
          {activePrescriptions.length === 0 && (
            <div className="text-center py-8">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No active prescriptions</p>
            </div>
          )}
        </div>
      </div>

      {/* Pending Prescriptions */}
      {pendingPrescriptions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Pending Prescriptions
          </h2>
          <div className="space-y-3">
            {pendingPrescriptions.map((prescription: any, index: number) => (
              <div key={index} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{prescription.medication_name}</h3>
                    {getStatusBadge(prescription.status)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Dosage:</span>
                    <span className="ml-2 text-gray-900">{prescription.dosage}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Frequency:</span>
                    <span className="ml-2 text-gray-900">{prescription.frequency}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Requested:</span>
                    <span className="ml-2 text-gray-900">{new Date(prescription.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescription History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Prescription History
        </h2>
        <div className="space-y-3">
          {discontinuedPrescriptions.slice(0, 5).map((prescription: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{prescription.medication_name}</h3>
                  {getStatusBadge(prescription.status)}
                </div>
                <span className="text-xs text-gray-500">
                  Discontinued: {new Date(prescription.discontinued_date || prescription.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Dosage:</span>
                  <span className="ml-2 text-gray-900">{prescription.dosage}</span>
                </div>
                <div>
                  <span className="text-gray-500">Frequency:</span>
                  <span className="ml-2 text-gray-900">{prescription.frequency}</span>
                </div>
                <div>
                  <span className="text-gray-500">Prescribed:</span>
                  <span className="ml-2 text-gray-900">{new Date(prescription.prescribed_date).toLocaleDateString()}</span>
                </div>
              </div>
              {prescription.discontinuation_reason && (
                <div className="mt-2">
                  <span className="text-gray-500 text-sm">Reason for discontinuation:</span>
                  <p className="text-sm text-gray-700 mt-1">{prescription.discontinuation_reason}</p>
                </div>
              )}
            </div>
          ))}
          {discontinuedPrescriptions.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No prescription history</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Prescription Modal - Placeholder for now */}
      {showAddPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Prescription</h3>
              <button
                onClick={() => setShowAddPrescriptionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Prescription form will be implemented here.</p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAddPrescriptionModal(false)}
              >
                Cancel
              </Button>
              <Button>
                Add Prescription
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientPrescriptions
