import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  FileText,
  Save
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { appointmentService } from '../../services/appointmentService'
import { fetchAppointments } from '../../features/appointments/appointmentsSlice'

// Simplified form validation schema
const quickAppointmentSchema = z.object({
  patient_id: z.number().min(1, 'Patient is required'),
  scheduled_at: z.string().min(1, 'Date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  type: z.enum(['consultation', 'therapy', 'follow_up', 'coaching'], {
    required_error: 'Appointment type is required'
  }),
  location: z.string().optional(),
  notes: z.string().optional(),
})

type QuickAppointmentFormData = z.infer<typeof quickAppointmentSchema>

interface QuickAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const QuickAppointmentModal: React.FC<QuickAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const dispatch = useDispatch()
  const { patients } = useSelector((state: RootState) => state.patients)
  
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<QuickAppointmentFormData>({
    resolver: zodResolver(quickAppointmentSchema),
    defaultValues: {
      type: 'consultation',
      location: 'In-Person',
      scheduled_at: new Date().toISOString().split('T')[0],
      start_time: '09:00',
    }
  })

  const onSubmit = async (data: QuickAppointmentFormData) => {
    setLoading(true)
    try {
      const scheduledDateTime = new Date(`${data.scheduled_at}T${data.start_time}`).toISOString()
      
      const appointmentData = {
        ...data,
        scheduled_at: scheduledDateTime,
        duration_minutes: 30, // Default 30 minutes for quick appointments
      }

      await appointmentService.createAppointment(appointmentData)
      
      reset()
      onClose()
      dispatch(fetchAppointments({}))
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Quick Schedule
              </h2>
              <p className="text-sm text-gray-600">
                Schedule a new appointment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                {...register('patient_id', { valueAsNumber: true })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </option>
                ))}
              </select>
            </div>
            {errors.patient_id && (
              <p className="mt-1 text-sm text-red-600">{errors.patient_id.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  {...register('scheduled_at')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.scheduled_at && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduled_at.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="time"
                  {...register('start_time')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.start_time && (
                <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
              )}
            </div>
          </div>

          {/* Type and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="consultation">Consultation</option>
                <option value="therapy">Therapy</option>
                <option value="follow_up">Follow-up</option>
                <option value="coaching">Coaching</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  {...register('location')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="In-Person">In-Person</option>
                  <option value="Telehealth">Telehealth</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Quick notes..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuickAppointmentModal





