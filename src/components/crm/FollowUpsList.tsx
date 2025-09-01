import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { RootState } from '../../store'
import { 
  setFollowUps, 
  removeFollowUp, 
  setSelectedFollowUp,
  setShowFollowUpModal 
} from '../../features/crm/crmSlice'

interface FollowUp {
  id: number
  lead_id: number
  contact_id: number
  scheduled_at: string
  type: string
  status: string
  notes: string
  created_at: string
  updated_at: string
  lead?: {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
  }
  contact?: {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
  }
}

const FollowUpsList: React.FC = () => {
  const dispatch = useDispatch()
  const { followUps, isLoading, showFollowUpModal } = useSelector((state: RootState) => state.crm)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    // Mock data for demonstration
    const mockFollowUps = [
      {
        id: 1,
        lead_id: 1,
        contact_id: 1,
        scheduled_at: '2024-01-15T10:00:00Z',
        type: 'call',
        status: 'scheduled',
        notes: 'Follow up on proposal',
        created_at: '2024-01-10T09:00:00Z',
        updated_at: '2024-01-10T09:00:00Z',
        lead: {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890'
        }
      },
      {
        id: 2,
        lead_id: 2,
        contact_id: 2,
        scheduled_at: '2024-01-16T14:00:00Z',
        type: 'email',
        status: 'completed',
        notes: 'Sent proposal details',
        created_at: '2024-01-11T11:00:00Z',
        updated_at: '2024-01-12T15:00:00Z',
        contact: {
          id: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+1987654321'
        }
      }
    ]
    dispatch(setFollowUps(mockFollowUps))
  }, [dispatch])

  const handleAddFollowUp = () => {
    dispatch(setSelectedFollowUp(null))
    dispatch(setShowFollowUpModal(true))
  }

  const handleEditFollowUp = (followUp: FollowUp) => {
    dispatch(setSelectedFollowUp(followUp))
    dispatch(setShowFollowUpModal(true))
  }

  const handleDeleteFollowUp = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this follow-up?')) {
      dispatch(removeFollowUp(id))
    }
  }

  const filteredFollowUps = followUps.filter((followUp: FollowUp) => {
    const matchesSearch = 
      followUp.lead?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.lead?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.contact?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.contact?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      followUp.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || followUp.status === statusFilter
    const matchesType = typeFilter === 'all' || followUp.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Follow-ups</h2>
          <p className="text-gray-600 mt-1">Manage and track follow-up activities</p>
        </div>
        <button
          onClick={handleAddFollowUp}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Follow-up</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search follow-ups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="task">Task</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Follow-ups List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredFollowUps.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No follow-ups found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your first follow-up.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <button
                onClick={handleAddFollowUp}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Follow-up
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFollowUps.map((followUp: FollowUp) => (
                  <tr key={followUp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {followUp.lead ? 
                              `${followUp.lead.first_name} ${followUp.lead.last_name}` :
                              followUp.contact ? 
                                `${followUp.contact.first_name} ${followUp.contact.last_name}` :
                                'Unknown Contact'
                            }
                          </div>
                          <div className="text-sm text-gray-500">
                            {followUp.lead?.email || followUp.contact?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {followUp.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(followUp.scheduled_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(followUp.status)}`}>
                        {getStatusIcon(followUp.status)}
                        <span className="ml-1">{followUp.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {followUp.notes || 'No notes'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditFollowUp(followUp)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFollowUp(followUp.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {filteredFollowUps.filter(f => f.status === 'scheduled').length}
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {filteredFollowUps.filter(f => f.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {filteredFollowUps.filter(f => f.status === 'overdue').length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              {filteredFollowUps.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FollowUpsList
