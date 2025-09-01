import React, { useState, useEffect } from 'react'
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
  Video, 
  Building2,
  DollarSign,
  Repeat,
  Trash2,
  Save,
  Share2,
  Building
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { appointmentService } from '../../services/appointmentService'
import { fetchAppointments } from '../../features/appointments/appointmentsSlice'
import { fetchPatients } from '../../features/patients/patientSlice'
import { facilityService, Facility } from '../../services/facilityService'
import { locationService, Location } from '../../services/locationService'

// Form validation schema
const appointmentSchema = z.object({
  patient_id: z.number().min(1, 'Patient is required'),
  provider_id: z.number().optional(),
  coach_id: z.number().optional(),
  scheduled_at: z.string().min(1, 'Date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  duration_minutes: z.number().min(15, 'Minimum 15 minutes').max(480, 'Maximum 8 hours'),
  type: z.enum(['consultation', 'therapy', 'follow_up', 'coaching', 'onboarding', 'support'], {
    required_error: 'Appointment type is required'
  }),
  facility_id: z.number().optional(),
  location_id: z.number().optional(),
  notes: z.string().optional(),
  is_all_day: z.boolean().default(false),
  is_recurring: z.boolean().default(false),
  recurring_pattern: z.string().optional(),
  fee: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    }
    return val || 0;
  }).optional(),
  service_code: z.string().optional(),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface AppointmentSchedulingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
  selectedEvent?: any
  onSuccess?: () => void
}

const AppointmentSchedulingModal: React.FC<AppointmentSchedulingModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedEvent,
  onSuccess
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { patients } = useSelector((state: RootState) => state.patients)
  const { appointments } = useSelector((state: RootState) => state.appointments)
  
  const [loading, setLoading] = useState(false)
  const [isAllDay, setIsAllDay] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [duration, setDuration] = useState(30)
  const [showShareOptions, setShowShareOptions] = useState(false)
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
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      type: 'consultation',
      duration_minutes: 30,
      is_all_day: false,
      is_recurring: false,
      fee: 0,
    }
  })

  const watchStartTime = watch('start_time')
  const watchEndTime = watch('end_time')

  // Load patients when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPatients({}))
    }
  }, [isOpen, dispatch])

  // Load facilities when modal opens
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setLoadingFacilities(true)
        const response = await facilityService.getFacilities({ status: 'active' })
        console.log('Loaded facilities:', response.facilities)
        setFacilities(response.facilities)
        
        // If editing an appointment, load locations for the selected facility
        if (selectedEvent && selectedEvent.facility_id) {
          console.log('Loading locations for facility after facilities loaded:', selectedEvent.facility_id)
          setTimeout(() => {
            loadLocationsForFacility(selectedEvent.facility_id)
          }, 100)
        }
      } catch (error) {
        console.error('Failed to load facilities:', error)
      } finally {
        setLoadingFacilities(false)
      }
    }

    if (isOpen) {
      loadFacilities()
    }
  }, [isOpen, selectedEvent, setValue])

  // Load locations when facility changes
  const loadLocationsForFacility = async (facilityId: number) => {
    try {
      console.log('Loading locations for facility:', facilityId)
      setLoadingLocations(true)
      const response = await appointmentService.getFacilityLocations(facilityId)
      console.log('Locations response:', response)
      setLocations(response.locations)
      console.log('Set locations:', response.locations)
      
      // Location value is already set in form reset, no need to set it again
    } catch (error) {
      console.error('Failed to load locations for facility:', error)
      setLocations([])
    } finally {
      console.log('Finished loading locations, setLoadingLocations(false)')
      setLoadingLocations(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      if (selectedEvent) {
        // Edit existing appointment
        console.log('Editing appointment - selectedEvent:', selectedEvent)
        console.log('Facility ID:', selectedEvent.facility_id)
        console.log('Location ID:', selectedEvent.location_id)
        console.log('Fee value from selectedEvent:', selectedEvent.fee, 'Type:', typeof selectedEvent.fee)
        
        const eventDate = new Date(selectedEvent.scheduled_at)
        
        // Reset form with all values including facility and location
        const resetData = {
          patient_id: selectedEvent.patient_id,
          provider_id: selectedEvent.provider_id,
          coach_id: selectedEvent.coach_id,
          scheduled_at: eventDate.toISOString().split('T')[0],
          start_time: eventDate.toTimeString().slice(0, 5),
          duration_minutes: selectedEvent.duration_minutes || 30,
          type: selectedEvent.type,
          facility_id: selectedEvent.facility_id,
          location_id: selectedEvent.location_id,
          notes: selectedEvent.notes,
          fee: selectedEvent.fee ? (typeof selectedEvent.fee === 'string' ? parseFloat(selectedEvent.fee) : selectedEvent.fee) : 0,
          is_all_day: false,
          is_recurring: false,
        }
        console.log('Resetting form with data:', resetData)
        reset(resetData)
        console.log('Form reset complete. Fee value after reset:', watch('fee'))
        
        setDuration(selectedEvent.duration_minutes || 30)
        
        // Note: facility and location loading is handled in the facilities loading useEffect
             } else if (selectedDate) {
         // Create new appointment
         setValue('scheduled_at', selectedDate.toISOString().split('T')[0])
         
         // Extract time from selectedDate and set it as start time
         const hours = selectedDate.getHours().toString().padStart(2, '0')
         const minutes = selectedDate.getMinutes().toString().padStart(2, '0')
         const startTime = `${hours}:${minutes}`
         
         setValue('start_time', startTime)
         setValue('duration_minutes', 30)
         setDuration(30)
         
         // Calculate end time based on start time and duration
         const endTime = new Date(selectedDate.getTime() + 30 * 60000)
         const endHours = endTime.getHours().toString().padStart(2, '0')
         const endMinutes = endTime.getMinutes().toString().padStart(2, '0')
         const endTimeString = `${endHours}:${endMinutes}`
         setValue('end_time', endTimeString)
       }
    }
  }, [isOpen, selectedDate, selectedEvent, setValue])

  // Calculate end time based on start time and duration
  useEffect(() => {
    if (watchStartTime && duration) {
      const startTime = new Date(`2000-01-01T${watchStartTime}`)
      const endTime = new Date(startTime.getTime() + duration * 60000)
      const endTimeString = endTime.toTimeString().slice(0, 5)
      setValue('end_time', endTimeString)
    }
  }, [watchStartTime, duration, setValue])

  const onSubmit = async (data: AppointmentFormData) => {
    // Validate that the selected date is not in the past
    const selectedDate = new Date(`${data.scheduled_at}T${data.start_time}`)
    const now = new Date()
    
    if (selectedDate < now) {
      alert('Cannot schedule appointments in the past. Please select a future date and time.')
      return
    }
    
    setLoading(true)
    try {
      const scheduledDateTime = selectedDate.toISOString()
      
      const appointmentData = {
        ...data,
        scheduled_at: scheduledDateTime,
        duration_minutes: duration,
      }

      if (selectedEvent) {
        // Update existing appointment
        console.log('Updating appointment:', selectedEvent.id, appointmentData)
        await appointmentService.updateAppointment(selectedEvent.id, appointmentData)
      } else {
        // Create new appointment
        console.log('Creating new appointment:', appointmentData)
        await appointmentService.createAppointment(appointmentData)
      }
      
      reset()
      onClose()
      // Fetch all appointments to ensure the calendar shows updated data
      console.log('Refreshing appointments after save...')
      dispatch(fetchAppointments({ per_page: 'all' }))
      onSuccess?.()
    } catch (error) {
      console.error('Failed to save appointment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedEvent) return
    
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setLoading(true)
      try {
        await appointmentService.deleteAppointment(selectedEvent.id)
        onClose()
        // Fetch all appointments to ensure the calendar shows updated data
        dispatch(fetchAppointments({ per_page: 'all' }))
        onSuccess?.()
      } catch (error) {
        console.error('Failed to delete appointment:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleShare = () => {
    setShowShareOptions(!showShareOptions)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedEvent ? 'Edit Appointment' : 'Schedule Appointment'}
              </h2>
              <p className="text-sm text-gray-600">
                {selectedEvent ? selectedEvent.patient?.first_name + ' ' + selectedEvent.patient?.last_name : 'New appointment'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedEvent && (
              <>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  title="Share"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Share Options Dropdown */}
        {showShareOptions && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Join Video Appointment
              </button>
              <div className="relative">
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                  Share Link
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Date and Time Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="all_day"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="all_day" className="text-sm font-medium text-gray-700">
                  All day
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                     <input
                     type="date"
                     {...register('scheduled_at')}
                     min={new Date().toISOString().split('T')[0]}
                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   />
                </div>
                                 {errors.scheduled_at && (
                   <p className="mt-1 text-sm text-red-600">{errors.scheduled_at.message}</p>
                 )}
                 <p className="mt-1 text-xs text-gray-500">
                   Cannot schedule appointments in the past
                 </p>
              </div>

              {!isAllDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="time"
                        {...register('end_time')}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                    </div>
                    {errors.end_time && (
                      <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>

            {/* Patient and Provider Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    {...register('provider_id', { valueAsNumber: true })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a provider</option>
                    <option value={1}>Dr. Michael Lamke</option>
                    <option value={2}>Dr. Sarah Johnson</option>
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
                    value={watch('facility_id') || ''}
                    onChange={(e) => {
                      const facilityId = parseInt(e.target.value)
                      if (facilityId) {
                        loadLocationsForFacility(facilityId)
                      } else {
                        setLocations([])
                      }
                      setValue('location_id', undefined)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    value={watch('location_id') || ''}
                    disabled={!watch('facility_id') || loadingLocations}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                  Recurring
                </label>
              </div>
            </div>
          </div>

          {/* Services and Billing Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service
                </label>
                <select
                  {...register('type')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="consultation">Consultation</option>
                  <option value="therapy">Therapy Session</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="coaching">Coaching</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="support">Support Session</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Code
                </label>
                <input
                  type="text"
                  {...register('service_code')}
                  placeholder="e.g., EVOKE-01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    {...register('fee')}
                    placeholder="0.00"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                </div>
                {errors.fee && (
                  <p className="mt-1 text-sm text-red-600">{errors.fee.message}</p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Appointment total:</span>
                  <span className="font-medium">${watch('fee') || 0}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Client balance:</span>
                  <span className="font-medium">$0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Add notes about this appointment..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              {selectedEvent && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
            <div className="flex items-center space-x-3">
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
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AppointmentSchedulingModal
