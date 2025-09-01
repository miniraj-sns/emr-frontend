import React, { useState, useEffect } from 'react'
import { 
  Activity,
  Heart,
  Thermometer,
  Ruler,
  Weight,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  Calendar,
  User
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'
import vitalSignsService, {
  VitalSigns,
  CreateVitalSignsRequest,
  UpdateVitalSignsRequest
} from '../../services/vitalSignsService'
import VitalSignsModal from './VitalSignsModal'

interface PatientVitalSignsProps {
  patient: Patient
  onVitalSignsUpdated: () => void
}

const PatientVitalSigns: React.FC<PatientVitalSignsProps> = ({ patient, onVitalSignsUpdated }) => {
  // Data states
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([])
  
  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [showAddVitalSignsModal, setShowAddVitalSignsModal] = useState(false)
  const [selectedVitalSigns, setSelectedVitalSigns] = useState<VitalSigns | null>(null)

  // Load vital signs data when patient changes
  useEffect(() => {
    if (patient.id) {
      loadVitalSignsData()
    }
  }, [patient.id])

  const loadVitalSignsData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await vitalSignsService.getPatientVitalSigns(patient.id)
      setVitalSigns(response.vital_signs || [])
    } catch (err) {
      console.error('Error loading vital signs data:', err)
      setError('Failed to load vital signs data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddVitalSigns = () => {
    setSelectedVitalSigns(null)
    setShowAddVitalSignsModal(true)
  }

  const handleEditVitalSigns = (vitalSigns: VitalSigns) => {
    setSelectedVitalSigns(vitalSigns)
    setShowAddVitalSignsModal(true)
  }

  const handleModalClose = () => {
    setShowAddVitalSignsModal(false)
    setSelectedVitalSigns(null)
  }

  const handleDeleteVitalSigns = async (vitalSigns: VitalSigns) => {
    if (!confirm('Are you sure you want to delete this vital signs record? This action cannot be undone.')) {
      return
    }

    try {
      await vitalSignsService.deleteVitalSigns(patient.id, vitalSigns.id)
      await loadVitalSignsData()
      onVitalSignsUpdated()
    } catch (err) {
      console.error('Error deleting vital signs:', err)
      setError('Failed to delete vital signs')
    }
  }

  // Get latest vital signs
  const latestVitalSigns = vitalSigns.length > 0 ? vitalSigns[0] : null
  const recentVitalSigns = vitalSigns.slice(1, 6) // Show 5 most recent after the latest

  const getVitalSignIcon = (type: string) => {
    switch (type) {
      case 'height':
        return <Ruler className="h-4 w-4" />
      case 'weight':
        return <Weight className="h-4 w-4" />
      case 'blood_pressure':
        return <Heart className="h-4 w-4" />
      case 'temperature':
        return <Thermometer className="h-4 w-4" />
      case 'heart_rate':
        return <Activity className="h-4 w-4" />
      case 'oxygen_saturation':
        return <Activity className="h-4 w-4" />
      case 'respiratory_rate':
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getVitalSignStatus = (type: string, value: number | null) => {
    if (value === null || value === undefined) return 'normal'
    
    switch (type) {
      case 'blood_pressure_systolic':
        if (value < 90) return 'low'
        if (value > 140) return 'high'
        return 'normal'
      case 'blood_pressure_diastolic':
        if (value < 60) return 'low'
        if (value > 90) return 'high'
        return 'normal'
      case 'temperature':
        if (value < 95) return 'low'
        if (value > 100.4) return 'high'
        return 'normal'
      case 'heart_rate':
        if (value < 60) return 'low'
        if (value > 100) return 'high'
        return 'normal'
      case 'oxygen_saturation':
        if (value < 95) return 'low'
        return 'normal'
      case 'respiratory_rate':
        if (value < 12) return 'low'
        if (value > 20) return 'high'
        return 'normal'
      default:
        return 'normal'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'text-red-600'
      case 'low':
        return 'text-blue-600'
      default:
        return 'text-green-600'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading vital signs...</span>
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
              onClick={loadVitalSignsData}
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
      {/* Latest Vital Signs */}
      {latestVitalSigns && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Latest Vital Signs
            </h2>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleEditVitalSigns(latestVitalSigns)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleAddVitalSigns}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {latestVitalSigns.height && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <Ruler className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Height</p>
                  <p className="text-sm font-medium">{latestVitalSigns.height}</p>
                </div>
              </div>
            )}
            
            {latestVitalSigns.weight && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <Weight className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-sm font-medium">{latestVitalSigns.weight}</p>
                </div>
              </div>
            )}
            
            {(latestVitalSigns.blood_pressure_systolic || latestVitalSigns.blood_pressure_diastolic) && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <Heart className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Blood Pressure</p>
                  <p className={`text-sm font-medium ${getStatusColor(getVitalSignStatus('blood_pressure_systolic', latestVitalSigns.blood_pressure_systolic))}`}>
                    {latestVitalSigns.blood_pressure_systolic}/{latestVitalSigns.blood_pressure_diastolic}
                  </p>
                </div>
              </div>
            )}
            
            {latestVitalSigns.temperature && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <Thermometer className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Temperature</p>
                  <p className={`text-sm font-medium ${getStatusColor(getVitalSignStatus('temperature', latestVitalSigns.temperature))}`}>
                    {latestVitalSigns.temperature}°F
                  </p>
                </div>
              </div>
            )}
            
            {latestVitalSigns.heart_rate && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <Activity className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Heart Rate</p>
                  <p className={`text-sm font-medium ${getStatusColor(getVitalSignStatus('heart_rate', latestVitalSigns.heart_rate))}`}>
                    {latestVitalSigns.heart_rate} bpm
                  </p>
                </div>
              </div>
            )}
            
            {latestVitalSigns.oxygen_saturation && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <Activity className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">O2 Saturation</p>
                  <p className={`text-sm font-medium ${getStatusColor(getVitalSignStatus('oxygen_saturation', latestVitalSigns.oxygen_saturation))}`}>
                    {latestVitalSigns.oxygen_saturation}%
                  </p>
                </div>
              </div>
            )}
            
            {latestVitalSigns.respiratory_rate && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <Activity className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Respiratory Rate</p>
                  <p className={`text-sm font-medium ${getStatusColor(getVitalSignStatus('respiratory_rate', latestVitalSigns.respiratory_rate))}`}>
                    {latestVitalSigns.respiratory_rate} /min
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Recorded: {new Date(latestVitalSigns.recorded_at).toLocaleDateString()}</span>
            {latestVitalSigns.recordedBy && (
              <span>by {latestVitalSigns.recordedBy.first_name} {latestVitalSigns.recordedBy.last_name}</span>
            )}
          </div>
          
          {latestVitalSigns.notes && (
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">Notes:</span> {latestVitalSigns.notes}
            </div>
          )}
        </div>
      )}

      {/* Vital Signs History */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Vital Signs History ({vitalSigns.length})
          </h2>
          {!latestVitalSigns && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleAddVitalSigns}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          {recentVitalSigns.map((vitalSigns: VitalSigns, index: number) => (
            <div key={index} className="border border-gray-200 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {new Date(vitalSigns.recorded_at).toLocaleDateString()}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(vitalSigns.recorded_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditVitalSigns(vitalSigns)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleDeleteVitalSigns(vitalSigns)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                {vitalSigns.height && (
                  <div>
                    <span className="font-medium">Height:</span> {vitalSigns.height}
                  </div>
                )}
                {vitalSigns.weight && (
                  <div>
                    <span className="font-medium">Weight:</span> {vitalSigns.weight}
                  </div>
                )}
                {(vitalSigns.blood_pressure_systolic || vitalSigns.blood_pressure_diastolic) && (
                  <div>
                    <span className="font-medium">BP:</span> {vitalSigns.blood_pressure_systolic}/{vitalSigns.blood_pressure_diastolic}
                  </div>
                )}
                {vitalSigns.temperature && (
                  <div>
                    <span className="font-medium">Temp:</span> {vitalSigns.temperature}°F
                  </div>
                )}
                {vitalSigns.heart_rate && (
                  <div>
                    <span className="font-medium">HR:</span> {vitalSigns.heart_rate} bpm
                  </div>
                )}
                {vitalSigns.oxygen_saturation && (
                  <div>
                    <span className="font-medium">O2:</span> {vitalSigns.oxygen_saturation}%
                  </div>
                )}
                {vitalSigns.respiratory_rate && (
                  <div>
                    <span className="font-medium">RR:</span> {vitalSigns.respiratory_rate} /min
                  </div>
                )}
              </div>
              
              {vitalSigns.notes && (
                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-medium">Notes:</span> {vitalSigns.notes}
                </div>
              )}
            </div>
          ))}
          
          {vitalSigns.length === 0 && (
            <div className="text-center py-6">
              <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No vital signs recorded</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleAddVitalSigns}
                className="mt-2"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add First Reading
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Vital Signs Modal */}
      <VitalSignsModal
        isOpen={showAddVitalSignsModal}
        onClose={handleModalClose}
        patientId={patient.id}
        vitalSigns={selectedVitalSigns}
        mode={selectedVitalSigns ? 'edit' : 'add'}
        onSave={async (data) => {
          try {
            if (selectedVitalSigns) {
              await vitalSignsService.updateVitalSigns(patient.id, selectedVitalSigns.id, data as UpdateVitalSignsRequest)
            } else {
              await vitalSignsService.createVitalSigns(patient.id, data as CreateVitalSignsRequest)
            }
            await loadVitalSignsData()
            handleModalClose()
            onVitalSignsUpdated()
          } catch (err) {
            console.error('Error saving vital signs:', err)
            throw err
          }
        }}
      />
    </div>
  )
}

export default PatientVitalSigns
