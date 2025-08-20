import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Calendar, Clock, User, MapPin, FileText } from 'lucide-react'
import Button from '../ui/Button'
import { appointmentService } from '../../services/appointmentService'
import { createAppointment } from '../../features/appointments/appointmentsSlice'
import { useDispatch } from 'react-redux'

interface AdvancedScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
  selectedEvent?: any
  onSuccess?: () => void
}

const AdvancedScheduleModal: React.FC<AdvancedScheduleModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedEvent,
  onSuccess
}) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [isAllDay, setIsAllDay] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      category: 'appointment',
      title: 'Appointment',
      facility: 'Your Clinic Name Here',
      billing_facility: 'Your Clinic Name Here',
      type: 'coaching',
      duration_minutes: 60,
      status: '- None',
    }
  })

  useEffect(() => {
    if (isOpen && selectedDate) {
      setValue('scheduled_at', selectedDate.toISOString().split('T')[0])
      setValue('start_time', '09:00')
    }
  }, [isOpen, selectedDate, setValue])

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const scheduledDateTime = new Date(`${data.scheduled_at}T${data.start_time}`).toISOString()
      
      const appointmentData = {
        ...data,
        scheduled_at: scheduledDateTime,
        patient_id: 1, // Default patient for now
      }

      await dispatch(createAppointment(appointmentData))
      
      reset()
      onClose()
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedEvent ? 'Edit Appointment' : 'Schedule Appointment'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
          {/* Top Row - Category, Title, Facility, Billing */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                              <select
                  {...register('category')}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                <option value="appointment">Appointment</option>
                <option value="consultation">Consultation</option>
                <option value="therapy">Therapy</option>
                <option value="follow_up">Follow Up</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                              <select
                  {...register('title')}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                <option value="Appointment">Appointment</option>
                <option value="Initial Consultation">Initial Consultation</option>
                <option value="Follow-up Visit">Follow-up Visit</option>
                <option value="Therapy Session">Therapy Session</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facility</label>
              <select
                {...register('facility')}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Your Clinic Name Here">Your Clinic Name Here</option>
                <option value="Main Office">Main Office</option>
                <option value="Branch Office">Branch Office</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Billing Facility</label>
              <select
                {...register('billing_facility')}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Your Clinic Name Here">Your Clinic Name Here</option>
                <option value="Main Office">Main Office</option>
                <option value="Branch Office">Branch Office</option>
              </select>
            </div>
          </div>

          {/* Patient and Provider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <input
                type="text"
                value="Gound, Kartik"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <input
                type="text"
                value="Administrator, Administrator"
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                readOnly
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">All day event</span>
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    {...register('scheduled_at')}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {!isAllDay && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      {...register('start_time')}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  {...register('duration_minutes')}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                <select
                  {...register('type')}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="coaching">Coaching</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  {...register('location')}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Location</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Office A">Office A</option>
                  <option value="Office B">Office B</option>
                  <option value="Conference Room 1">Conference Room 1</option>
                  <option value="Conference Room 2">Conference Room 2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status and Room */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="- None">- None</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="no_show">No Show</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <select
                {...register('room_number')}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Room</option>
                <option value="101">Room 101</option>
                <option value="102">Room 102</option>
                <option value="103">Room 103</option>
                <option value="Conference A">Conference A</option>
                <option value="Conference B">Conference B</option>
              </select>
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
            <textarea
              {...register('comments')}
              rows={2}
              placeholder="Add any notes or comments about this appointment..."
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
            >
              Find Available
            </Button>
            {selectedEvent && (
              <Button
                type="button"
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
            >
              Create Duplicate
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdvancedScheduleModal
