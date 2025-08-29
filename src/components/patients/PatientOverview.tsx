import React from 'react'
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
  Thermometer
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'

interface PatientOverviewProps {
  patient: Patient
}

const PatientOverview: React.FC<PatientOverviewProps> = ({ patient }) => {
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

  // Get latest vital signs
  const latestVitals = patient?.vital_signs?.[0]
  
  // Get active and discontinued medications
  const activeMedications = patient?.medications?.filter((med: any) => med.status === 'active') || []
  const discontinuedMedications = patient?.medications?.filter((med: any) => med.status === 'discontinued') || []

  return (
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
          <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Vital Signs
            </div>
            <span className="text-sm font-normal text-gray-500">
              ({new Date(latestVitals?.updated_at || patient.updated_at).toLocaleDateString()})
            </span>
          </h2>
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
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg p-2">
          <h3 className="text-md font-semibold text-gray-900 mb-1 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming Appointments
          </h3>
          <div className="space-y-1">
            {patient.appointments?.filter((apt: any) => apt.status === 'scheduled').slice(0, 2).map((appointment: any, index: number) => (
              <div key={index} className="p-1 bg-blue-50 rounded border border-blue-200 text-sm">
                <p className="font-medium text-gray-900 capitalize">{appointment.type}</p>
                <p className="text-xs text-gray-600">
                  {new Date(appointment.scheduled_at).toLocaleDateString()} at {new Date(appointment.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <p className="text-xs text-gray-500">
                  {appointment.provider ? `with ${appointment.provider.first_name} ${appointment.provider.last_name}` : 'No provider assigned'}
                </p>
              </div>
            ))}
            {patient.appointments?.filter((apt: any) => apt.status === 'scheduled').length === 0 && (
              <p className="text-xs text-gray-500 text-center">No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>

      {/* Column 3 - Medications and Allergies (40%) */}
      <div className="space-y-1 lg:col-span-4 bg-purple-50 rounded-lg p-1">
        {/* Current Medications */}
        <div className="bg-white rounded-lg p-2">
          <h3 className="text-md font-semibold text-gray-900 mb-1 flex items-center">
            <Pill className="h-4 w-4 mr-2" />
            Current Medications
          </h3>
          <div className="space-y-1">
            {activeMedications.slice(0, 3).map((medication: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-1 bg-gray-50 rounded text-sm">
                <div>
                  <p className="font-medium text-gray-900">{medication.medication_name}</p>
                  <p className="text-xs text-gray-600">{medication.dosage} • {medication.frequency}</p>
                </div>
                <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
        <div className="bg-white rounded-lg p-2">
          <h3 className="text-md font-semibold text-gray-900 mb-1 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            Allergies
          </h3>
          <div className="space-y-1">
            {patient.allergies?.slice(0, 3).map((allergy: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-1 bg-red-50 rounded border border-red-200 text-sm">
                <div>
                  <p className="font-medium text-gray-900">{allergy.allergen}</p>
                  <p className="text-xs text-gray-600">{allergy.reaction}</p>
                </div>
                <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ${
                  allergy.severity === 'Severe' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {allergy.severity}
                </span>
              </div>
            ))}
            {patient.allergies?.length > 3 && (
              <p className="text-xs text-gray-500 text-center">+{patient.allergies.length - 3} more</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientOverview
