import React, { useEffect, useState } from 'react'
import { 
  Clock, 
  Calendar, 
  MessageSquare, 
  FileImage, 
  FileText, 
  BarChart3,
  Plus
} from 'lucide-react'
import Button from '../ui/Button'
import { PatientTimelineEvent, PatientTimelineFilters } from '../../types/patient'

interface PatientTimelineProps {
  patientId: number
}

const PatientTimeline: React.FC<PatientTimelineProps> = ({ patientId }) => {
  const [timelineEvents, setTimelineEvents] = useState<PatientTimelineEvent[]>([])
  const [timelineLoading, setTimelineLoading] = useState(false)
  const [timelineFilters, setTimelineFilters] = useState<PatientTimelineFilters>({})

  useEffect(() => {
    loadTimelineData()
  }, [patientId, timelineFilters])

  const loadTimelineData = async () => {
    setTimelineLoading(true)
    try {
      const { patientService } = await import('../../services/patientService')
      const response = await patientService.getPatientTimeline(patientId, timelineFilters)
      setTimelineEvents(response.timeline)
    } catch (error) {
      console.error('Failed to load timeline data:', error)
    } finally {
      setTimelineLoading(false)
    }
  }

  const handleTimelineFilterChange = (newFilters: Partial<PatientTimelineFilters>) => {
    setTimelineFilters(prev => ({ ...prev, ...newFilters }))
  }

  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
    return `${Math.floor(diffInSeconds / 31536000)} years ago`
  }

  return (
    <div className="space-y-6">
      {/* Patient Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Patient Timeline
          </h2>
          <div className="flex items-center space-x-2">
            <select 
              className="text-sm border border-gray-300 rounded-md px-3 py-1"
              value={timelineFilters.type || ''}
              onChange={(e) => handleTimelineFilterChange({ type: e.target.value as any || undefined })}
            >
              <option value="">All Events</option>
              <option value="appointment">Appointments</option>
              <option value="note">Notes</option>
              <option value="file">Files</option>
              <option value="form">Forms</option>
              <option value="report">Reports</option>
            </select>
            <input 
              type="date" 
              className="text-sm border border-gray-300 rounded-md px-3 py-1"
              placeholder="Start Date"
              value={timelineFilters.start_date || ''}
              onChange={(e) => handleTimelineFilterChange({ start_date: e.target.value || undefined })}
            />
            <input 
              type="date" 
              className="text-sm border border-gray-300 rounded-md px-3 py-1"
              placeholder="End Date"
              value={timelineFilters.end_date || ''}
              onChange={(e) => handleTimelineFilterChange({ end_date: e.target.value || undefined })}
            />
            <Button 
              size="sm" 
              variant="outline"
              onClick={loadTimelineData}
              disabled={timelineLoading}
            >
              {timelineLoading ? 'Loading...' : 'Filter'}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Timeline Events */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Timeline Events */}
            <div className="space-y-6">
              {timelineLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading timeline...</p>
                </div>
              ) : timelineEvents.length > 0 ? (
                timelineEvents.map((event) => {
                  const getEventIcon = () => {
                    switch (event.event_type) {
                      case 'appointment':
                        return { icon: Calendar, bgColor: 'bg-blue-100', textColor: 'text-blue-600' }
                      case 'note':
                        return { icon: MessageSquare, bgColor: 'bg-green-100', textColor: 'text-green-600' }
                      case 'file':
                        return { icon: FileImage, bgColor: 'bg-purple-100', textColor: 'text-purple-600' }
                      case 'form':
                        return { icon: FileText, bgColor: 'bg-orange-100', textColor: 'text-orange-600' }
                      case 'report':
                        return { icon: BarChart3, bgColor: 'bg-red-100', textColor: 'text-red-600' }
                      default:
                        return { icon: Clock, bgColor: 'bg-gray-100', textColor: 'text-gray-600' }
                    }
                  }

                  const { icon: EventIcon, bgColor, textColor } = getEventIcon()
                  const eventDate = new Date(event.created_at)
                  const timeAgo = getTimeAgo(eventDate)

                  return (
                    <div key={event.id} className="relative flex items-start">
                      <div className={`flex-shrink-0 w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
                        <EventIcon className={`h-5 w-5 ${textColor}`} />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                          <span className="text-xs text-gray-500">{timeAgo}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            event.status === 'completed' || event.status === 'published' || event.status === 'scheduled'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'draft' || event.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status}
                          </span>
                          {event.metadata && Object.keys(event.metadata).length > 0 && (
                            <span className="text-xs text-gray-500">
                              {event.metadata.duration && `Duration: ${event.metadata.duration}`}
                              {event.metadata.file_size && `Size: ${event.metadata.file_size}`}
                              {event.metadata.report_type && `Type: ${event.metadata.report_type}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No timeline events found</p>
                  <p className="text-sm text-gray-400 mt-1">Patient activity will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientTimeline
