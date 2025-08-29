import React, { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Video, 
  MessageSquare, 
  Edit, 
  FileText 
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'
import ScheduleAppointmentModal from '../appointments/ScheduleAppointmentModal'

interface PatientAppointmentsProps {
  patient: Patient
  onAppointmentCreated: () => void
}

const PatientAppointments: React.FC<PatientAppointmentsProps> = ({ patient, onAppointmentCreated }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  return (
    <div className="space-y-6">
      {/* Appointment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{patient.appointments?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{patient.appointments?.filter((apt: any) => apt.status === 'scheduled').length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{patient.appointments?.filter((apt: any) => apt.status === 'completed').length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">No Show</p>
              <p className="text-2xl font-bold text-gray-900">{patient.appointments?.filter((apt: any) => apt.status === 'no_show').length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Appointments
          </h2>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowScheduleModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
        <div className="space-y-3">
          {patient.appointments?.filter((apt: any) => apt.status === 'scheduled').map((appointment: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{new Date(appointment.scheduled_at).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-600">{new Date(appointment.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p className="text-xs text-gray-500">{appointment.duration_minutes} min</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{appointment.type}</p>
                  <p className="text-sm text-gray-600">
                    {appointment.provider ? `with ${appointment.provider.first_name} ${appointment.provider.last_name}` : 'No provider assigned'}
                  </p>
                  {appointment.coach && (
                    <p className="text-xs text-gray-500">Coach: {appointment.coach.first_name} {appointment.coach.last_name}</p>
                  )}
                  {appointment.location && (
                    <p className="text-xs text-gray-500">{appointment.location}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4 mr-1" />
                  Join
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
          {patient.appointments?.filter((apt: any) => apt.status === 'scheduled').length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Appointments
        </h2>
        <div className="space-y-3">
          {patient.appointments?.filter((apt: any) => ['completed', 'no_show', 'canceled'].includes(apt.status)).slice(0, 5).map((appointment: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{new Date(appointment.scheduled_at).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-600">{new Date(appointment.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p className="text-xs text-gray-500">{appointment.duration_minutes} min</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{appointment.type}</p>
                  <p className="text-sm text-gray-600">
                    {appointment.provider ? `with ${appointment.provider.first_name} ${appointment.provider.last_name}` : 'No provider assigned'}
                  </p>
                  {appointment.coach && (
                    <p className="text-xs text-gray-500">Coach: {appointment.coach.first_name} {appointment.coach.last_name}</p>
                  )}
                  {appointment.notes && (
                    <p className="text-xs text-gray-500">{appointment.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'no_show' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {appointment.status.replace('_', ' ').toUpperCase()}
                </span>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-1" />
                  Notes
                </Button>
              </div>
            </div>
          ))}
          {patient.appointments?.filter((apt: any) => ['completed', 'no_show', 'canceled'].includes(apt.status)).length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      <ScheduleAppointmentModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        patientId={patient?.id}
        onSuccess={() => {
          onAppointmentCreated()
          setShowScheduleModal(false)
        }}
      />
    </div>
  )
}

export default PatientAppointments
