import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Calendar, Clock, User, MapPin, FileText, Building } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { appointmentService } from '../../services/appointmentService'
import { createAppointment } from '../../features/appointments/appointmentsSlice'
import { useDispatch } from 'react-redux'
import { facilityService, Facility } from '../../services/facilityService'
import { locationService, Location } from '../../services/locationService'

// Form validation schema
const appointmentSchema = z.object({
  patient_id: z.number().min(1, 'Patient is required'),
  provider_id: z.number().optional(),
  coach_id: z.number().optional(),
  scheduled_at: z.string().min(1, 'Date and time is required'),
  duration_minutes: z.number().min(15, 'Minimum 15 minutes').max(480, 'Maximum 8 hours'),
  type: z.enum(['coaching', 'onboarding', 'support'], {
    required_error: 'Appointment type is required'
  }),
  facility_id: z.number().optional(),
  location_id: z.number().optional(),
  notes: z.string().optional(),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface ScheduleAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  patientId?: number
  onSuccess?: () => void
}

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role?: string
}

const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({
  isOpen,
  onClose,
  patientId,
  onSuccess
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [providers, setProviders] = useState<User[]>([])
  const [coaches, setCoaches] = useState<User[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loadingFacilities, setLoadingFacilities] = useState(false)
  const [loadingLocations, setLoadingLocations] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: patientId || 0,
      duration_minutes: 60,
      type: 'coaching',
    }
  })

  // Set patient ID when modal opens
  useEffect(() => {
    if (patientId) {
      setValue('patient_id', patientId)
    }
  }, [patientId, setValue])

  // Load providers and coaches
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // In a real app, you'd fetch these from your API
        // For now, we'll use mock data
        const mockProviders: User[] = [
          { id: 1, first_name: 'Dr. Sarah', last_name: 'Johnson', email: 'sarah.johnson@mindbrite.com', role: 'provider' },
          { id: 2, first_name: 'Dr. Michael', last_name: 'Chen', email: 'michael.chen@mindbrite.com', role: 'provider' },
          { id: 3, first_name: 'Dr. Emily', last_name: 'Davis', email: 'emily.davis@mindbrite.com', role: 'provider' },
        ]
        
        const mockCoaches: User[] = [
          { id: 4, first_name: 'Coach', last_name: 'Wilson', email: 'coach.wilson@mindbrite.com', role: 'coach' },
          { id: 5, first_name: 'Coach', last_name: 'Brown', email: 'coach.brown@mindbrite.com', role: 'coach' },
          { id: 6, first_name: 'Coach', last_name: 'Taylor', email: 'coach.taylor@mindbrite.com', role: 'coach' },
        ]

        setProviders(mockProviders)
        setCoaches(mockCoaches)
      } catch (error) {
        console.error('Failed to load users:', error)
      }
    }

    if (isOpen) {
      loadUsers()
    }
  }, [isOpen])

  // Load facilities
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setLoadingFacilities(true)
        const response = await facilityService.getFacilities({ status: 'active' })
        setFacilities(response.facilities)
      } catch (error) {
        console.error('Failed to load facilities:', error)
      } finally {
        setLoadingFacilities(false)
      }
    }

    if (isOpen) {
      loadFacilities()
    }
  }, [isOpen])

  // Load locations when facility changes
  const loadLocationsForFacility = async (facilityId: number) => {
    try {
      setLoadingLocations(true)
      const response = await appointmentService.getFacilityLocations(facilityId)
      setLocations(response.locations)
    } catch (error) {
      console.error('Failed to load locations for facility:', error)
      setLocations([])
    } finally {
      setLoadingLocations(false)
    }
  }

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true)
    try {
      // Format the scheduled_at to include time
      const scheduledDateTime = new Date(data.scheduled_at).toISOString()
      
      const appointmentData = {
        ...data,
        scheduled_at: scheduledDateTime,
      }

      await dispatch(createAppointment(appointmentData))
      
      // Reset form and close modal
      reset()
      onClose()
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      reset()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Schedule Appointment</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date & Time
              </label>
              <input
                type="datetime-local"
                {...register('scheduled_at')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.scheduled_at ? 'border-red-500' : 'border-gray-300'
                }`}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.scheduled_at && (
                <p className="mt-1 text-sm text-red-600">{errors.scheduled_at.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Duration (minutes)
              </label>
              <select
                {...register('duration_minutes', { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.duration_minutes ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
              {errors.duration_minutes && (
                <p className="mt-1 text-sm text-red-600">{errors.duration_minutes.message}</p>
              )}
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Type
            </label>
            <select
              {...register('type')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="coaching">Coaching</option>
              <option value="onboarding">Onboarding</option>
              <option value="support">Support</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Provider and Coach */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Provider (Optional)
              </label>
              <select
                {...register('provider_id', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Provider</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.first_name} {provider.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Coach (Optional)
              </label>
              <select
                {...register('coach_id', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Coach</option>
                {coaches.map((coach) => (
                  <option key={coach.id} value={coach.id}>
                    {coach.first_name} {coach.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Facility and Location Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="h-4 w-4 inline mr-1" />
                Facility
              </label>
              <select
                {...register('facility_id', { valueAsNumber: true })}
                onChange={(e) => {
                  const facilityId = parseInt(e.target.value)
                  if (facilityId) {
                    loadLocationsForFacility(facilityId)
                  } else {
                    setLocations([])
                  }
                  setValue('location_id', undefined)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Facility</option>
                {loadingFacilities ? (
                  <option value="" disabled>Loading facilities...</option>
                ) : (
                  facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location
              </label>
              <select
                {...register('location_id', { valueAsNumber: true })}
                disabled={!watch('facility_id') || loadingLocations}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Location</option>
                {loadingLocations ? (
                  <option value="" disabled>Loading locations...</option>
                ) : watch('facility_id') ? (
                  locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} {location.city && location.state ? `(${location.city}, ${location.state})` : ''}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Select a facility first</option>
                )}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Add any notes about this appointment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScheduleAppointmentModal
