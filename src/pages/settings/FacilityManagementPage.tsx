import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Filter,
  MoreVertical,
  Eye
} from 'lucide-react'
import { facilityService, Facility } from '../../services/facilityService'
import FacilityModal from '../../components/facilities/FacilityModal'

const FacilityManagementPage: React.FC = () => {
  const location = useLocation()
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')

  useEffect(() => {
    loadFacilities()
    
    // Auto-open add modal if navigating to /facilities/new
    if (location.pathname === '/facilities/new') {
      setSelectedFacility(null)
      setModalType('add')
      setShowModal(true)
    }
  }, [location.pathname])

  const loadFacilities = async () => {
    try {
      setLoading(true)
      console.log('Loading facilities...')
      console.log('User token:', localStorage.getItem('user_token'))
      console.log('User data:', localStorage.getItem('user_data'))
      
      const params: any = {}
      if (searchTerm) params.search = searchTerm
      if (statusFilter !== 'all') params.status = statusFilter
      
      const response = await facilityService.getFacilities(params)
      console.log('Facilities response:', response)
      setFacilities(response.facilities)
      setError(null)
    } catch (err: any) {
      console.error('Error loading facilities:', err)
      console.error('Error response:', err.response?.data)
      setError(err.response?.data?.message || 'Failed to load facilities')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFacility = () => {
    setSelectedFacility(null)
    setModalType('add')
    setShowModal(true)
  }

  const handleEditFacility = async (facility: Facility) => {
    try {
      // Fetch the full facility data with locations
      const response = await facilityService.getFacility(facility.id)
      setSelectedFacility(response.facility)
      setModalType('edit')
      setShowModal(true)
    } catch (err: any) {
      console.error('Error fetching facility details:', err)
      setError(err.response?.data?.message || 'Failed to load facility details')
    }
  }

  const handleDeleteFacility = async (facility: Facility) => {
    if (!confirm(`Are you sure you want to delete "${facility.name}"?`)) {
      return
    }

    try {
      await facilityService.deleteFacility(facility.id)
      await loadFacilities()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete facility')
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedFacility(null)
  }

  const handleModalSave = async () => {
    await loadFacilities()
    handleModalClose()
  }

  const getStatusBadge = (facility: Facility) => {
    if (facility.is_inactive) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Inactive</span>
    }
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
  }

  const getTypeBadge = (facility: Facility) => {
    const types = []
    if (facility.is_service_location) types.push('Service')
    if (facility.is_billing_location) types.push('Billing')
    if (facility.is_primary_business_entity) types.push('Primary')
    
    if (types.length === 0) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">General</span>
    }
    
    return types.map((type, index) => (
      <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mr-1">
        {type}
      </span>
    ))
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.physical_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.phone?.includes(searchTerm) ||
                         facility.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && !facility.is_inactive) ||
                         (statusFilter === 'inactive' && facility.is_inactive) ||
                         (statusFilter === 'service' && facility.is_service_location) ||
                         (statusFilter === 'billing' && facility.is_billing_location)
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-2 max-w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facilities</h1>
          <p className="text-gray-600 mt-1">Manage your medical facilities and locations.</p>
        </div>
        <button
          onClick={handleAddFacility}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Facility
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search facilities by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Facilities Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FACILITY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CONTACT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TYPE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CREATED
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFacilities.map((facility) => (
                <tr key={facility.id} className="hover:bg-gray-50">
                  {/* Facility Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                          style={{ backgroundColor: facility.color || '#3B82F6' }}
                        >
                          {getInitials(facility.name)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{facility.name}</div>
                        <div className="text-sm text-gray-500">
                          {facility.physical_city && facility.physical_state 
                            ? `${facility.physical_city}, ${facility.physical_state}`
                            : 'Location not specified'
                          }
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {facility.email && (
                        <div className="flex items-center mb-1">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="truncate max-w-xs">{facility.email}</span>
                        </div>
                      )}
                      {facility.phone && (
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          <span>{facility.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(facility)}
                  </td>

                  {/* Type Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {getTypeBadge(facility)}
                    </div>
                  </td>

                  {/* Created Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(facility.created_at)}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditFacility(facility)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditFacility(facility)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFacility(facility)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
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

        {/* Empty State */}
        {filteredFacilities.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first facility'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={handleAddFacility}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Facility
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <FacilityModal
          facility={selectedFacility}
          type={modalType}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  )
}

export default FacilityManagementPage
