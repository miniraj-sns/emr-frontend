import React, { useState, useEffect } from 'react'
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
  Trash2,
  Loader2
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'
import prescriptionService, {
  Prescription,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest
} from '../../services/prescriptionService'
import PrescriptionModal from './PrescriptionModal'

interface PatientPrescriptionsProps {
  patient: Patient
  onPrescriptionUpdated: () => void
}

const PatientPrescriptions: React.FC<PatientPrescriptionsProps> = ({ patient, onPrescriptionUpdated }) => {
  // Data states
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  
  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)

  // Load prescription data when patient changes
  useEffect(() => {
    if (patient.id) {
      loadPrescriptionData()
    }
  }, [patient.id])

  const loadPrescriptionData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await prescriptionService.getPatientPrescriptions(patient.id)
      setPrescriptions(response.data || [])
    } catch (err) {
      console.error('Error loading prescription data:', err)
      setError('Failed to load prescription data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPrescription = () => {
    setSelectedPrescription(null)
    setShowAddPrescriptionModal(true)
  }

  const handleEditPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setShowAddPrescriptionModal(true)
  }

  const handleModalClose = () => {
    setShowAddPrescriptionModal(false)
    setSelectedPrescription(null)
  }

  const handleDiscontinuePrescription = async (prescription: Prescription) => {
    if (!confirm('Are you sure you want to discontinue this prescription?')) {
      return
    }

    try {
      await prescriptionService.updatePrescription(patient.id, prescription.id, {
        ...prescription,
        is_active: false
      } as UpdatePrescriptionRequest)
      await loadPrescriptionData()
      onPrescriptionUpdated()
    } catch (err) {
      console.error('Error discontinuing prescription:', err)
      setError('Failed to discontinue prescription')
    }
  }

  // Get active and discontinued prescriptions
  const activePrescriptions = prescriptions.filter((prescription) => prescription.is_active)
  const discontinuedPrescriptions = prescriptions.filter((prescription) => !prescription.is_active)
  const pendingPrescriptions = [] // No pending status in current data structure

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
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading prescriptions...</span>
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
              onClick={loadPrescriptionData}
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
      {/* Prescription Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center">
            <Pill className="h-6 w-6 text-blue-500 mr-2" />
            <div>
              <p className="text-xs font-medium text-gray-600">Total</p>
              <p className="text-lg font-bold text-gray-900">{prescriptions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <div>
              <p className="text-xs font-medium text-gray-600">Active</p>
              <p className="text-lg font-bold text-gray-900">{activePrescriptions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-yellow-500 mr-2" />
            <div>
              <p className="text-xs font-medium text-gray-600">Pending</p>
              <p className="text-lg font-bold text-gray-900">{pendingPrescriptions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-500 mr-2" />
            <div>
              <p className="text-xs font-medium text-gray-600">Discontinued</p>
              <p className="text-lg font-bold text-gray-900">{discontinuedPrescriptions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Prescriptions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center">
            <Pill className="h-4 w-4 mr-2" />
            Active Prescriptions ({activePrescriptions.length})
          </h2>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleAddPrescription}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {activePrescriptions.map((prescription: any, index: number) => (
            <div key={index} className="border border-green-200 rounded-md p-3 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 text-sm">{prescription.drug_name}</h3>
                  {getStatusBadge(prescription.is_active ? 'active' : 'discontinued')}
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditPrescription(prescription)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleDiscontinuePrescription(prescription)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Quantity:</span> {prescription.quantity} {prescription.size || ''}
                </div>
                <div>
                  <span className="font-medium">Route:</span> {prescription.route?.name || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Interval:</span> {prescription.interval?.name || 'Not specified'}
                </div>
              </div>
              {prescription.notes && (
                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-medium">Notes:</span> {prescription.notes}
                </div>
              )}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Prescribed: {new Date(prescription.starting_date).toLocaleDateString()}</span>
                {prescription.refills !== undefined && (
                  <span>Refills: {prescription.refills}</span>
                )}
              </div>
            </div>
          ))}
          {activePrescriptions.length === 0 && (
            <div className="text-center py-6">
              <Pill className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No active prescriptions</p>
            </div>
          )}
        </div>
      </div>

      {/* Pending Prescriptions */}
      {pendingPrescriptions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Pending Prescriptions ({pendingPrescriptions.length})
          </h2>
          <div className="space-y-2">
            {pendingPrescriptions.map((prescription: any, index: number) => (
              <div key={index} className="border border-yellow-200 rounded-md p-3 bg-yellow-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 text-sm">{prescription.drug_name}</h3>
                    {getStatusBadge(prescription.is_active ? 'active' : 'discontinued')}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditPrescription(prescription)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Quantity:</span> {prescription.quantity} {prescription.size || ''}
                  </div>
                  <div>
                    <span className="font-medium">Route:</span> {prescription.route?.name || 'Not specified'}
                  </div>
                  <div>
                    <span className="font-medium">Requested:</span> {new Date(prescription.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescription History */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Prescription History ({discontinuedPrescriptions.length})
        </h2>
        <div className="space-y-2">
          {discontinuedPrescriptions.slice(0, 3).map((prescription: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 text-sm">{prescription.drug_name}</h3>
                  {getStatusBadge(prescription.is_active ? 'active' : 'discontinued')}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(prescription.discontinued_date || prescription.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Quantity:</span> {prescription.quantity} {prescription.size || ''}
                </div>
                <div>
                  <span className="font-medium">Route:</span> {prescription.route?.name || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Prescribed:</span> {new Date(prescription.starting_date).toLocaleDateString()}
                </div>
              </div>
              {prescription.discontinuation_reason && (
                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-medium">Reason:</span> {prescription.discontinuation_reason}
                </div>
              )}
            </div>
          ))}
          {discontinuedPrescriptions.length === 0 && (
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No prescription history</p>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={showAddPrescriptionModal}
        onClose={handleModalClose}
        patientId={patient.id}
        prescription={selectedPrescription}
        mode={selectedPrescription ? 'edit' : 'add'}
        onSave={async (data) => {
          try {
            if (selectedPrescription) {
              await prescriptionService.updatePrescription(patient.id, selectedPrescription.id, data as UpdatePrescriptionRequest)
            } else {
              await prescriptionService.createPrescription(patient.id, data as CreatePrescriptionRequest)
            }
            await loadPrescriptionData()
            handleModalClose()
            onPrescriptionUpdated()
          } catch (err) {
            console.error('Error saving prescription:', err)
            throw err
          }
        }}
      />
    </div>
  )
}

export default PatientPrescriptions
