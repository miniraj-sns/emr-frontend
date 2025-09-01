import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone, Mail, Edit, Trash2, Eye } from 'lucide-react';
import { locationService, Location } from '../../services/locationService';
import LocationModal from '../../components/locations/LocationModal';

const LocationManagementPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [viewingLocation, setViewingLocation] = useState<Location | null>(null);

  const locationTypes = [
    { value: 'general', label: 'General' },
    { value: 'clinic', label: 'Clinic' },
    { value: 'lab', label: 'Laboratory' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'imaging', label: 'Imaging Center' },
    { value: 'urgent_care', label: 'Urgent Care' },
    { value: 'specialty', label: 'Specialty Center' },
    { value: 'surgery', label: 'Surgery Center' },
    { value: 'rehab', label: 'Rehabilitation' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    loadLocations();
  }, [searchTerm, filterType, filterStatus]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      console.log('Loading locations with filters:', { searchTerm, filterType, filterStatus });
      
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      
      const response = await locationService.getLocations(params);
      console.log('Locations loaded:', response);
      setLocations(response.locations);
      setError(null);
    } catch (err) {
      console.error('Error loading locations:', err);
      setError('Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setShowModal(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setShowModal(true);
  };

  const handleViewLocation = (location: Location) => {
    setViewingLocation(location);
  };

  const handleDeleteLocation = async (location: Location) => {
    if (!window.confirm(`Are you sure you want to delete "${location.name}"?`)) {
      return;
    }

    try {
      await locationService.deleteLocation(location.id);
      await loadLocations();
    } catch (err) {
      console.error('Error deleting location:', err);
      setError('Failed to delete location');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingLocation(null);
  };

  const handleLocationSaved = () => {
    setShowModal(false);
    setEditingLocation(null);
    loadLocations();
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLocationTypeLabel = (type: string): string => {
    const typeObj = locationTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getLocationTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      general: 'bg-gray-100 text-gray-800',
      clinic: 'bg-blue-100 text-blue-800',
      lab: 'bg-green-100 text-green-800',
      pharmacy: 'bg-purple-100 text-purple-800',
      imaging: 'bg-yellow-100 text-yellow-800',
      urgent_care: 'bg-red-100 text-red-800',
      specialty: 'bg-indigo-100 text-indigo-800',
      surgery: 'bg-pink-100 text-pink-800',
      rehab: 'bg-teal-100 text-teal-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Location Management</h1>
          <p className="text-gray-600">Manage locations that can be associated with facilities</p>
        </div>
        <button
          onClick={handleAddLocation}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Location
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, city, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {locationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Locations Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations.map((location) => (
                <tr key={location.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
                          style={{ backgroundColor: location.color || '#6B7280' }}
                        >
                          {getInitials(location.name)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {location.name}
                        </div>
                        {location.code && (
                          <div className="text-sm text-gray-500">
                            Code: {location.code}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLocationTypeColor(location.location_type)}`}>
                      {getLocationTypeLabel(location.location_type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {location.address && (
                        <div className="flex items-center text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="truncate max-w-xs">
                            {location.city && location.state 
                              ? `${location.city}, ${location.state}`
                              : location.address
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {location.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1" />
                          {location.phone}
                        </div>
                      )}
                      {location.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-1" />
                          {location.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      location.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {location.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(location.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewLocation(location)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditLocation(location)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location)}
                        className="text-red-600 hover:text-red-900"
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
          
          {locations.length === 0 && !loading && (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No locations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType || filterStatus 
                  ? 'Try adjusting your search filters'
                  : 'Get started by creating a new location'
                }
              </p>
              {!searchTerm && !filterType && !filterStatus && (
                <div className="mt-6">
                  <button
                    onClick={handleAddLocation}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add Location
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <LocationModal
          location={editingLocation}
          onClose={handleModalClose}
          onSave={handleLocationSaved}
        />
      )}

      {viewingLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Location Details</h2>
                <button
                  onClick={() => setViewingLocation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{viewingLocation.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Code</label>
                    <p className="text-sm text-gray-900">{viewingLocation.code || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="text-sm text-gray-900">{getLocationTypeLabel(viewingLocation.location_type)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      viewingLocation.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {viewingLocation.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {viewingLocation.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="text-sm text-gray-900">{viewingLocation.address}</p>
                    {(viewingLocation.city || viewingLocation.state || viewingLocation.zip_code) && (
                      <p className="text-sm text-gray-900">
                        {[viewingLocation.city, viewingLocation.state, viewingLocation.zip_code].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {viewingLocation.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{viewingLocation.phone}</p>
                    </div>
                  )}
                  {viewingLocation.email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{viewingLocation.email}</p>
                    </div>
                  )}
                  {viewingLocation.website && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Website</label>
                      <a 
                        href={viewingLocation.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {viewingLocation.website}
                      </a>
                    </div>
                  )}
                </div>
                
                {viewingLocation.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900">{viewingLocation.description}</p>
                  </div>
                )}
                
                {viewingLocation.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-sm text-gray-900">{viewingLocation.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationManagementPage;
