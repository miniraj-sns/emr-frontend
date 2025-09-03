import React from 'react'
import { 
  User, 
  Calendar, 
  Clock, 
  Heart, 
  Pill, 
  AlertTriangle, 
  Users, 
  Phone,
  Mail,
  MapPin,
  Thermometer,
  Activity,
  Weight,
  Ruler,
  Shield,
  UserCheck,
  FileText,
  Plus,
  ChevronDown,
  Edit
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'

interface PatientOverviewProps {
  patient: Patient
}

const PatientOverview2: React.FC<PatientOverviewProps> = ({ patient }) => {
  // Get latest vital signs
  const latestVitals = patient?.vital_signs?.[0]
  
  // Get active medications
  const activeMedications = patient?.medications?.filter((med: any) => med.status === 'active') || []

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
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
        {(patient.address_line1 || patient.city || patient.state) && (
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">
                    {patient.address_line1 && <span>{patient.address_line1}</span>}
                    {patient.city && patient.state && (
                      <span>{patient.city}, {patient.state}</span>
                    )}
                    {patient.postal_code && <span> {patient.postal_code}</span>}
                    {patient.country && <span> {patient.country}</span>}
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Email */}
        {patient.email && (
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Emergency Contact</h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900">Mike Hernandez</p>
                <span className="text-xs text-blue-600">Son</span>
                <span className="text-sm text-gray-600">•</span>
                <p className="text-sm text-gray-600">077 6432 9935</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Last Encounter */}
        <div className="bg-white rounded-lg p-3 border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Last Encounter</h3>
              <p className="text-sm text-gray-600">19 Jul 2019 with Dr. Veera</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Column - History/Timeline */}
      <div className="w-1/2 space-y-1">
        {/* History Card */}
        <div className="bg-white rounded-lg border">
          {/* Main Navigation Tabs */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="flex space-x-8">
              <button className="text-teal-600 border-b-2 border-teal-600 pb-2 font-medium text-sm">
                History
              </button>
              <button className="text-gray-500 hover:text-gray-700 pb-2 font-medium text-sm">
                Insurance
              </button>
              <button className="text-gray-500 hover:text-gray-700 pb-2 font-medium text-sm">
                Appointments
              </button>
            </div>
            <Button size="sm" className="bg-teal-500 hover:bg-teal-600 border-0">
              <Plus className="h-3 w-3 mr-1" />
              Add History
            </Button>
          </div>

          {/* Timeline Events */}
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Patient has submitted their CT scan. Awaiting analysis.</p>
                  <p className="text-xs text-gray-500">15 Jun 2019 by Martin Nichols</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Dr. Grant visit concluded. Patient needs CT scan. Report updated.</p>
                  <p className="text-xs text-gray-500">15 Jun 2019 by Martin Nichols</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Patient made a visit for check up. Form submitted.</p>
                  <p className="text-xs text-gray-500">15 Jun 2019 by Martin Nichols</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Diabetes report has been verified, sent to patient.</p>
                  <p className="text-xs text-gray-500">15 Jun 2019 by Martin Nichols</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Card */}
        <div className="bg-white rounded-lg border">
          {/* Documents Navigation Tabs */}
          <div className="flex space-x-8 px-4 py-2 border-b">
            <button className="text-teal-600 border-b-2 border-teal-600 pb-1 font-medium text-sm">
              Documents
            </button>
            <button className="text-gray-500 hover:text-gray-700 pb-1 font-medium text-sm">
              Activities
            </button>
            <button className="text-gray-500 hover:text-gray-700 pb-1 font-medium text-sm">
              Timeline
            </button>
            <button className="text-gray-500 hover:text-gray-700 pb-1 font-medium text-sm">
              Data Privacy
            </button>
          </div>

          {/* Documents Content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Documents</h4>
              <Button size="sm" className="bg-teal-500 hover:bg-teal-600 border-0">
                <Plus className="h-3 w-3 mr-1" />
                Upload File
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <span className="font-medium">File name</span>
                <span className="font-medium">Uploaded by</span>
                <span className="font-medium">Uploaded Date</span>
                <span className="font-medium">Clearance</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                <span className="text-gray-900">CT Scan.jpg</span>
                <span className="text-gray-600">Mariam, 2322</span>
                <span className="text-gray-600">15 Jun 2019</span>
                <span className="text-yellow-600 font-medium">Pending</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                <span className="text-gray-900">Health report.jpg</span>
                <span className="text-gray-600">Dr. Grant, 0012</span>
                <span className="text-gray-600">15 Jun 2019</span>
                <span className="text-green-600 font-medium">Verified</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                <span className="text-gray-900">Prescription.jpg</span>
                <span className="text-gray-600">Emmanuel, 8221</span>
                <span className="text-gray-600">02 May 2019</span>
                <span className="text-green-600 font-medium">Verified</span>
              </div>
            </div>
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
                ({new Date(latestVitals?.updated_at || patient.updated_at).toLocaleDateString()})
              </span>
              <button className="text-gray-400 hover:text-gray-600">
                <Clock className="h-4 w-4" />
              </button>
            </div>
          </h3>
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
        </div>

        {/* Medical Summary */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="text-sm font-semibold text-teal-600 mb-3">Medical Summary</h3>
          
          {/* Conditions */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-600 mb-2">Conditions</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Type 2 Diabetes Mellitus</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Moderate Chronic Obstructive Pulmonary Disease</span>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-600 mb-2">Medications</h4>
            <div className="space-y-1">
              {activeMedications.slice(0, 4).map((medication: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{medication.medication_name}</span>
                </div>
              ))}
              {activeMedications.length === 0 && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Avandia</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">BD Ultrfine Needles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Insulin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Lisinprol</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Allergies</h4>
            <div className="space-y-1">
              {patient.allergies?.slice(0, 2).map((allergy: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{allergy.allergen}</span>
                </div>
              ))}
              {(!patient.allergies || patient.allergies.length === 0) && (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Penicillin</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Sulfa</span>
                  </div>
                </>
              )}
            </div>
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

export default PatientOverview2
