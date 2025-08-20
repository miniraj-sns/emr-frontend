import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, User, MapPin } from 'lucide-react'
import { RootState } from '../../store'
import { fetchAppointments } from '../../features/appointments/appointmentsSlice'
import Button from '../../components/ui/Button'
import AdvancedScheduleModal from '../../components/appointments/AdvancedScheduleModal'

type ViewType = 'month' | 'week' | 'day'

const CalendarPage: React.FC = () => {
  const dispatch = useDispatch()
  const { appointments } = useSelector((state: RootState) => state.appointments)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>('month')
  const [showAdvancedModal, setShowAdvancedModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchAppointments())
  }, [dispatch])

  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push(prevDate)
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    return appointments.filter((apt: any) => {
      const eventDate = new Date(apt.scheduled_at)
      return eventDate.toDateString() === date.toDateString()
    }).sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
  }

  const getEventsForTimeSlot = (date: Date, hour: number, minute?: number) => {
    return appointments.filter((apt: any) => {
      const eventDate = new Date(apt.scheduled_at)
      const dateMatch = eventDate.toDateString() === date.toDateString()
      const hourMatch = eventDate.getHours() === hour
      const minuteMatch = minute !== undefined ? eventDate.getMinutes() === minute : true
      return dateMatch && hourMatch && minuteMatch
    })
  }

  // Helper function to create 15-minute time slots
  const createTimeSlots = () => {
    const timeSlots = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        timeSlots.push({
          hour,
          minute,
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          displayTime: `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`
        })
      }
    }
    return timeSlots
  }

  // Week view helpers
  const getWeekDays = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    
    return week
  }

  const days = getDaysInMonth(currentDate)
  const currentMonth = currentDate.getMonth()

  // Render week view
  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate)
    const timeSlots = createTimeSlots()
    
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Time column and day headers */}
          <div className="grid grid-cols-8 gap-px bg-gray-200 border border-gray-200">
            <div className="bg-gray-50 p-3"></div>
            {weekDays.map(day => (
              <div key={day.toISOString()} className="bg-gray-50 p-3 text-center">
                <div className="text-sm font-medium text-gray-900">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-bold ${
                  day.toDateString() === new Date().toDateString() ? 'text-primary-600' : 'text-gray-700'
                }`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>
          
          {/* Time slots */}
          {timeSlots.map((slot, index) => (
            <div key={index} className="grid grid-cols-8 gap-px bg-gray-200 border-b border-gray-200">
              <div className="bg-white p-1 text-xs text-gray-500 text-right pr-2">
                {slot.displayTime}
              </div>
              {weekDays.map(day => {
                const events = getEventsForTimeSlot(day, slot.hour, slot.minute)
                return (
                  <div key={`${day.toISOString()}-${slot.hour}-${slot.minute}`} className="bg-white min-h-[30px] p-1">
                    {events.map((event: any) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded mb-0.5 ${
                          event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'completed' ? 'bg-green-100 text-green-800' :
                          event.status === 'no_show' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.patient?.first_name} {event.type}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render day view
  const renderDayView = () => {
    const timeSlots = createTimeSlots()
    const events = getEventsForDate(currentDate)
    
    return (
      <div className="overflow-y-auto max-h-[600px]">
        {timeSlots.map((slot, index) => {
          const slotEvents = events.filter((event: any) => {
            const eventDate = new Date(event.scheduled_at)
            const eventHour = eventDate.getHours()
            const eventMinute = eventDate.getMinutes()
            return eventHour === slot.hour && eventMinute === slot.minute
          })
          
          return (
            <div key={index} className="flex border-b border-gray-200">
              <div className="w-24 p-2 text-sm text-gray-500 text-right border-r border-gray-200">
                {slot.displayTime}
              </div>
              <div className="flex-1 p-2 min-h-[40px]">
                {slotEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className={`p-2 rounded-lg mb-1 ${
                      event.status === 'scheduled' ? 'bg-blue-50 border-l-4 border-blue-500' :
                      event.status === 'completed' ? 'bg-green-50 border-l-4 border-green-500' :
                      event.status === 'no_show' ? 'bg-red-50 border-l-4 border-red-500' :
                      'bg-gray-50 border-l-4 border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {event.patient?.first_name} {event.patient?.last_name}
                        </h4>
                        <p className="text-xs text-gray-600 capitalize">{event.type}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                          {new Date(new Date(event.scheduled_at).getTime() + event.duration_minutes * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        {event.location && (
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage and schedule appointments</p>
        </div>
        <Button onClick={() => setShowAdvancedModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={goToPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" onClick={goToNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <h2 className="text-lg font-semibold text-gray-900">
              {viewType === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              {viewType === 'week' && `Week of ${getWeekDays(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              {viewType === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewType === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('month')}
            >
              Month
            </Button>
            <Button
              variant={viewType === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('week')}
            >
              Week
            </Button>
            <Button
              variant={viewType === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('day')}
            >
              Day
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow">
        {viewType === 'month' && (
          <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentMonth
              const isToday = day.toDateString() === new Date().toDateString()
              const events = getEventsForDate(day)
              
              return (
                <div
                  key={index}
                  className={`min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !isCurrentMonth ? 'text-gray-400' : ''
                  }`}
                  onClick={() => {
                    setSelectedDate(day)
                    setShowAdvancedModal(true)
                  }}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  {/* Events */}
                  <div className="space-y-1">
                    {events.slice(0, 3).map((event: any) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate cursor-pointer ${
                          event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'completed' ? 'bg-green-100 text-green-800' :
                          event.status === 'no_show' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEvent(event)
                          setShowAdvancedModal(true)
                        }}
                      >
                        {event.patient?.first_name} {event.type}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{events.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {viewType === 'week' && renderWeekView()}
        {viewType === 'day' && renderDayView()}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Legend</h3>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
            <span className="text-sm text-gray-600">No Show</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Canceled</span>
          </div>
        </div>
      </div>

      {/* Advanced Schedule Modal */}
      <AdvancedScheduleModal
        isOpen={showAdvancedModal}
        onClose={() => {
          setShowAdvancedModal(false)
          setSelectedDate(null)
          setSelectedEvent(null)
        }}
        selectedDate={selectedDate || undefined}
        selectedEvent={selectedEvent}
        onSuccess={() => {
          dispatch(fetchAppointments())
        }}
      />
    </div>
  )
}

export default CalendarPage
