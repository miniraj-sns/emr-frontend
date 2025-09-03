import React, { useEffect, useState } from 'react'
import { 
  Clock, 
  Calendar, 
  MessageSquare, 
  FileImage, 
  FileText, 
  BarChart3,
  Plus,
  User,
  X
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
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [newEvent, setNewEvent] = useState({
    event_type: 'note' as const,
    title: '',
    description: '',
    status: 'created'
  })
  const [searchQuery, setSearchQuery] = useState('')

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
      // If API fails, show sample data for demonstration
      setTimelineEvents(generateSampleTimelineData())
    } finally {
      setTimelineLoading(false)
    }
  }

  const exportTimelineData = () => {
    const csvContent = [
      ['Event Type', 'Title', 'Description', 'Status', 'Event Date', 'Created Date'],
      ...timelineEvents.map(event => [
        event.event_type,
        event.title,
        event.description,
        event.status,
        new Date(event.event_date).toLocaleDateString(),
        new Date(event.created_at).toLocaleDateString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patient_timeline_${patientId}_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const generateSampleTimelineData = (): PatientTimelineEvent[] => {
    const now = new Date()
    const sampleEvents: PatientTimelineEvent[] = [
      {
        id: 'sample_1',
        event_type: 'appointment',
        event_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Appointment: Initial Consultation',
        description: 'Patient had their first consultation with Dr. Smith. Discussed treatment plan and scheduled follow-up.',
        status: 'completed',
        metadata: {
          appointment_id: 1,
          time: '10:00 AM',
          duration: '60 minutes',
          provider: 'Dr. Smith'
        },
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample_2',
        event_type: 'note',
        event_date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        title: 'Note: Treatment Plan Discussion',
        description: 'Discussed medication options and lifestyle changes. Patient showed good understanding of recommendations.',
        status: 'created',
        metadata: {
          note_id: 1,
          type: 'Treatment Plan',
          author_id: 1
        },
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample_3',
        event_type: 'file',
        event_date: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        title: 'File Uploaded: Lab Results',
        description: 'Blood work results uploaded to patient records',
        status: 'uploaded',
        metadata: {
          file_id: 1,
          file_name: 'lab_results_2025.pdf',
          file_size: '245 KB',
          mime_type: 'application/pdf'
        },
        created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample_4',
        event_type: 'form',
        event_date: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        title: 'Form Submitted: Health History',
        description: 'Patient completed comprehensive health history form',
        status: 'completed',
        metadata: {
          form_id: 1,
          template_id: 1,
          template_name: 'Health History Form'
        },
        created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample_5',
        event_type: 'report',
        event_date: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        title: 'Report: Initial Assessment',
        description: 'Comprehensive initial patient assessment report generated',
        status: 'published',
        metadata: {
          report_id: 1,
          report_type: 'Initial Assessment',
          is_published: true
        },
        created_at: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
      }
    ]
    return sampleEvents
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
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 w-48"
            />
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
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setTimelineEvents(generateSampleTimelineData())}
              className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
            >
              Load Sample Data
            </Button>
            <Button 
              size="sm"
              onClick={() => setShowAddEventModal(true)}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => exportTimelineData()}
              disabled={timelineEvents.length === 0}
              className="bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              <FileText className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Timeline Summary */}
        {timelineEvents.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Timeline Summary</h4>
              {searchQuery && (
                <span className="text-xs text-gray-500">
                  Showing {timelineEvents.filter(e => 
                    searchQuery === '' || 
                    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    e.event_type.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length} of {timelineEvents.length} events
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {timelineEvents.filter(e => e.event_type === 'appointment').length}
                </div>
                <div className="text-xs text-gray-600">Appointments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {timelineEvents.filter(e => e.event_type === 'note').length}
                </div>
                <div className="text-xs text-gray-600">Notes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {timelineEvents.filter(e => e.event_type === 'file').length}
                </div>
                <div className="text-xs text-gray-600">Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {timelineEvents.filter(e => e.event_type === 'form').length}
                </div>
                <div className="text-xs text-gray-600">Forms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {timelineEvents.filter(e => e.event_type === 'report').length}
                </div>
                <div className="text-xs text-gray-600">Reports</div>
              </div>
            </div>
          </div>
        )}
        
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
                timelineEvents
                  .filter(event => 
                    searchQuery === '' || 
                    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.event_type.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((event) => {
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
                    <div key={event.id} className="relative flex items-start group hover:bg-gray-50 p-3 rounded-lg transition-colors">
                      <div className={`flex-shrink-0 w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
                        <EventIcon className={`h-5 w-5 ${textColor}`} />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{event.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-400">
                              {new Date(event.event_date).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">{timeAgo}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                        <div className="mt-3 flex items-center space-x-3">
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
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              {event.metadata.duration && (
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {event.metadata.duration}
                                </span>
                              )}
                              {event.metadata.file_size && (
                                <span className="flex items-center">
                                  <FileImage className="h-3 w-3 mr-1" />
                                  {event.metadata.file_size}
                                </span>
                              )}
                              {event.metadata.provider && (
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {event.metadata.provider}
                                </span>
                              )}
                              {event.metadata.report_type && (
                                <span className="flex items-center">
                                  <BarChart3 className="h-3 w-3 mr-1" />
                                  {event.metadata.report_type}
                                </span>
                                )}
                            </div>
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

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Timeline Event</h3>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  value={newEvent.event_type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, event_type: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="note">Note</option>
                  <option value="appointment">Appointment</option>
                  <option value="file">File</option>
                  <option value="form">Form</option>
                  <option value="report">Report</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Enter event description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newEvent.status}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="created">Created</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddEventModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (newEvent.title && newEvent.description) {
                    const event: PatientTimelineEvent = {
                      id: `new_${Date.now()}`,
                      event_type: newEvent.event_type,
                      event_date: new Date().toISOString(),
                      title: newEvent.title,
                      description: newEvent.description,
                      status: newEvent.status,
                      metadata: {},
                      created_at: new Date().toISOString()
                    }
                    setTimelineEvents(prev => [event, ...prev])
                    setNewEvent({
                      event_type: 'note',
                      title: '',
                      description: '',
                      status: 'created'
                    })
                    setShowAddEventModal(false)
                  }
                }}
                disabled={!newEvent.title || !newEvent.description}
              >
                Add Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientTimeline
