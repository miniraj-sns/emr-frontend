import React, { useState, useEffect } from 'react'
import { X, Palette, MapPin, Phone, Mail, Globe, Building, FileText } from 'lucide-react'
import { facilityService, Facility, CreateFacilityRequest } from '../../services/facilityService'
import { locationService, Location } from '../../services/locationService'

interface FacilityModalProps {
  facility?: Facility | null
  type: 'add' | 'edit'
  onClose: () => void
  onSave: () => void
}

const FacilityModal: React.FC<FacilityModalProps> = ({ facility, type, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreateFacilityRequest>({
    name: '',
    color: '#3B82F6',
    physical_address: '',
    physical_city: '',
    physical_state: '',
    physical_zip_code: '',
    physical_country: '',
    mailing_address: '',
    mailing_city: '',
    mailing_state: '',
    mailing_zip_code: '',
    mailing_country: '',
    phone: '',
    fax: '',
    website: '',
    email: '',
    pos_code: '',
    clia_number: '',
    tax_id_type: 'EIN',
    tax_id: '',
    facility_npi: '',
    iban: '',
    facility_taxonomy: '',
    billing_attn: '',
    facility_lab_code: '',
    oid: '',
    is_billing_location: false,
    accepts_assignment: false,
    is_service_location: true,
    is_primary_business_entity: false,
    is_inactive: false,
    info: ''
  })

  const [activeAddressTab, setActiveAddressTab] = useState<'physical' | 'mailing'>('physical')
  const [loading, setLoading] = useState(false)
  
  // Location-related state
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocations, setSelectedLocations] = useState<number[]>([])
  const [primaryLocationId, setPrimaryLocationId] = useState<number | null>(null)
  const [loadingLocations, setLoadingLocations] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load locations on component mount
  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      setLoadingLocations(true)
      const response = await locationService.getLocations({ status: 'active' })
      setLocations(response.locations)
    } catch (error) {
      console.error('Error loading locations:', error)
    } finally {
      setLoadingLocations(false)
    }
  }

  useEffect(() => {
    if (facility && type === 'edit') {
      setFormData({
        name: facility.name || '',
        color: facility.color || '#3B82F6',
        physical_address: facility.physical_address || '',
        physical_city: facility.physical_city || '',
        physical_state: facility.physical_state || '',
        physical_zip_code: facility.physical_zip_code || '',
        physical_country: facility.physical_country || '',
        mailing_address: facility.mailing_address || '',
        mailing_city: facility.mailing_city || '',
        mailing_state: facility.mailing_state || '',
        mailing_zip_code: facility.mailing_zip_code || '',
        mailing_country: facility.mailing_country || '',
        phone: facility.phone || '',
        fax: facility.fax || '',
        website: facility.website || '',
        email: facility.email || '',
        pos_code: facility.pos_code || '',
        clia_number: facility.clia_number || '',
        tax_id_type: facility.tax_id_type || 'EIN',
        tax_id: facility.tax_id || '',
        facility_npi: facility.facility_npi || '',
        iban: facility.iban || '',
        facility_taxonomy: facility.facility_taxonomy || '',
        billing_attn: facility.billing_attn || '',
        facility_lab_code: facility.facility_lab_code || '',
        oid: facility.oid || '',
        is_billing_location: facility.is_billing_location || false,
        accepts_assignment: facility.accepts_assignment || false,
        is_service_location: facility.is_service_location || true,
        is_primary_business_entity: facility.is_primary_business_entity || false,
        is_inactive: facility.is_inactive || false,
        info: facility.info || ''
      })

      // Load existing location assignments
      if (facility.locations && facility.locations.length > 0) {
        const assignedLocationIds = facility.locations.map(loc => loc.id)
        setSelectedLocations(assignedLocationIds)
        
        // Find primary location
        const primaryLocation = facility.locations.find(loc => loc.pivot?.is_primary)
        if (primaryLocation) {
          setPrimaryLocationId(primaryLocation.id)
        }
      }
    }
  }, [facility, type])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Prepare location assignments data
      const locationAssignments = selectedLocations.map(locationId => ({
        location_id: locationId,
        is_primary: locationId === primaryLocationId,
        is_billing_location: false, // Default value
        is_service_location: true,  // Default value
        notes: undefined
      }))

      // Combine form data with location assignments
      const submitData = {
        ...formData,
        location_assignments: locationAssignments
      }

      if (type === 'add') {
        await facilityService.createFacility(submitData)
      } else if (facility) {
        await facilityService.updateFacility(facility.id, submitData)
      }
      onSave()
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        setErrors({ general: err.response?.data?.message || 'An error occurred' })
      }
    } finally {
      setLoading(false)
    }
  }

  const posCodeOptions = [
    { value: '01', label: '01: Pharmacy' },
    { value: '02', label: '02: Unassigned' },
    { value: '03', label: '03: School' },
    { value: '04', label: '04: Homeless Shelter' },
    { value: '05', label: '05: Indian Health Service' },
    { value: '06', label: '06: Indian Health Service Provider' },
    { value: '07', label: '07: Tribal 638 Free Standing' },
    { value: '08', label: '08: Tribal 638 Hospital Based' },
    { value: '09', label: '09: Prison/Correctional Facility' },
    { value: '11', label: '11: Office' },
    { value: '12', label: '12: Home' },
    { value: '13', label: '13: Assisted Living Facility' },
    { value: '14', label: '14: Group Home' },
    { value: '15', label: '15: Mobile Unit' },
    { value: '16', label: '16: Temporary Lodging' },
    { value: '17', label: '17: Walk-in Retail Health Clinic' },
    { value: '18', label: '18: Place of Employment' },
    { value: '19', label: '19: Off Campus Outpatient Hospital' },
    { value: '20', label: '20: Urgent Care Facility' },
    { value: '21', label: '21: Inpatient Hospital' },
    { value: '22', label: '22: Outpatient Hospital' },
    { value: '23', label: '23: Emergency Room Hospital' },
    { value: '24', label: '24: Ambulatory Surgical Center' },
    { value: '25', label: '25: Birthing Center' },
    { value: '26', label: '26: Military Treatment Facility' },
    { value: '31', label: '31: Skilled Nursing Facility' },
    { value: '32', label: '32: Nursing Facility' },
    { value: '33', label: '33: Custodial Care Facility' },
    { value: '34', label: '34: Hospice' },
    { value: '41', label: '41: Ambulance Land' },
    { value: '42', label: '42: Ambulance Air or Water' },
    { value: '49', label: '49: Independent Clinic' },
    { value: '50', label: '50: Federally Qualified Health Center' },
    { value: '51', label: '51: Inpatient Psychiatric Facility' },
    { value: '52', label: '52: Psychiatric Facility Partial Hospitalization' },
    { value: '53', label: '53: Community Mental Health Center' },
    { value: '54', label: '54: Intermediate Care Facility/Individuals with Intellectual Disabilities' },
    { value: '55', label: '55: Residential Substance Abuse Treatment Facility' },
    { value: '56', label: '56: Psychiatric Residential Treatment Center' },
    { value: '57', label: '57: Non-residential Substance Abuse Treatment Facility' },
    { value: '60', label: '60: Mass Immunization Center' },
    { value: '61', label: '61: Comprehensive Inpatient Rehabilitation Facility' },
    { value: '62', label: '62: Comprehensive Outpatient Rehabilitation Facility' },
    { value: '65', label: '65: End-Stage Renal Disease Treatment Facility' },
    { value: '71', label: '71: State or Local Public Health Clinic' },
    { value: '72', label: '72: Rural Health Clinic' },
    { value: '81', label: '81: Independent Laboratory' },
    { value: '99', label: '99: Other Place of Service' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {type === 'add' ? 'Add Facility' : 'Edit Facility'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {errors.general && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* General Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">General Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facility Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color *
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="#3B82F6"
                      />
                      <Palette className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
                <div className="mb-4">
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => setActiveAddressTab('physical')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeAddressTab === 'physical'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Physical Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveAddressTab('mailing')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeAddressTab === 'mailing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Mailing Address
                    </button>
                  </div>
                </div>

                {activeAddressTab === 'physical' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={formData.physical_address}
                        onChange={(e) => handleInputChange('physical_address', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={formData.physical_city}
                          onChange={(e) => handleInputChange('physical_city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={formData.physical_state}
                          onChange={(e) => handleInputChange('physical_state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                        <input
                          type="text"
                          value={formData.physical_zip_code}
                          onChange={(e) => handleInputChange('physical_zip_code', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={formData.physical_country}
                          onChange={(e) => handleInputChange('physical_country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        value={formData.mailing_address}
                        onChange={(e) => handleInputChange('mailing_address', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={formData.mailing_city}
                          onChange={(e) => handleInputChange('mailing_city', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={formData.mailing_state}
                          onChange={(e) => handleInputChange('mailing_state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                        <input
                          type="text"
                          value={formData.mailing_zip_code}
                          onChange={(e) => handleInputChange('mailing_zip_code', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={formData.mailing_country}
                          onChange={(e) => handleInputChange('mailing_country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Administrative/Billing Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Administrative/Billing Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">POS Code</label>
                    <select
                      value={formData.pos_code}
                      onChange={(e) => handleInputChange('pos_code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select POS Code</option>
                      {posCodeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CLIA Number</label>
                    <input
                      type="text"
                      value={formData.clia_number}
                      onChange={(e) => handleInputChange('clia_number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID Type</label>
                      <select
                        value={formData.tax_id_type}
                        onChange={(e) => handleInputChange('tax_id_type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="EIN">EIN</option>
                        <option value="SSN">SSN</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
                      <input
                        type="text"
                        value={formData.tax_id}
                        onChange={(e) => handleInputChange('tax_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facility NPI</label>
                    <input
                      type="text"
                      value={formData.facility_npi}
                      onChange={(e) => handleInputChange('facility_npi', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
                    <input
                      type="tel"
                      value={formData.fax}
                      onChange={(e) => handleInputChange('fax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Billing Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Billing Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                    <input
                      type="text"
                      value={formData.iban}
                      onChange={(e) => handleInputChange('iban', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facility Taxonomy</label>
                    <input
                      type="text"
                      value={formData.facility_taxonomy}
                      onChange={(e) => handleInputChange('facility_taxonomy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Billing Attn</label>
                    <input
                      type="text"
                      value={formData.billing_attn}
                      onChange={(e) => handleInputChange('billing_attn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facility Lab Code</label>
                      <input
                        type="text"
                        value={formData.facility_lab_code}
                        onChange={(e) => handleInputChange('facility_lab_code', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OID</label>
                      <input
                        type="text"
                        value={formData.oid}
                        onChange={(e) => handleInputChange('oid', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Toggles */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Toggles</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Billing Location</label>
                      <p className="text-xs text-gray-500">Enable billing functionality</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('is_billing_location', !formData.is_billing_location)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.is_billing_location ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.is_billing_location ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Accepts Assignment</label>
                      <p className="text-xs text-gray-500">(only if billing location)</p>
                    </div>
                    <button
                      type="button"
                      disabled={!formData.is_billing_location}
                      onClick={() => handleInputChange('accepts_assignment', !formData.accepts_assignment)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.accepts_assignment ? 'bg-blue-600' : 'bg-gray-200'
                      } ${!formData.is_billing_location ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.accepts_assignment ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Service Location</label>
                      <p className="text-xs text-gray-500">Enable service functionality</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('is_service_location', !formData.is_service_location)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.is_service_location ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.is_service_location ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Primary Business Entity</label>
                      <p className="text-xs text-gray-500">Set as primary business</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('is_primary_business_entity', !formData.is_primary_business_entity)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.is_primary_business_entity ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.is_primary_business_entity ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Facility Inactive</label>
                      <p className="text-xs text-gray-500">Disable facility</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('is_inactive', !formData.is_inactive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.is_inactive ? 'bg-red-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.is_inactive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Info</h3>
                <textarea
                  value={formData.info}
                  onChange={(e) => handleInputChange('info', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional information about the facility..."
                />
              </div>

              {/* Location Assignment */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Location Assignment</h3>
                
                {loadingLocations ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading locations...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {locations.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <MapPin className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-600">No locations available</p>
                        <p className="text-sm text-gray-500">Create locations first to assign to this facility</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                          {locations.map((location) => (
                            <div key={location.id} className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                id={`location-${location.id}`}
                                checked={selectedLocations.includes(location.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedLocations(prev => [...prev, location.id])
                                  } else {
                                    setSelectedLocations(prev => prev.filter(id => id !== location.id))
                                    if (primaryLocationId === location.id) {
                                      setPrimaryLocationId(null)
                                    }
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label htmlFor={`location-${location.id}`} className="flex-1 cursor-pointer">
                                <div className="text-sm font-medium text-gray-900">
                                  {location.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {location.city && location.state ? `${location.city}, ${location.state}` : location.location_type}
                                </div>
                              </label>
                              {selectedLocations.includes(location.id) && (
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    name="primary-location"
                                    id={`primary-${location.id}`}
                                    checked={primaryLocationId === location.id}
                                    onChange={() => setPrimaryLocationId(location.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                  />
                                  <label htmlFor={`primary-${location.id}`} className="ml-1 text-xs text-gray-600">
                                    Primary
                                  </label>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {selectedLocations.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-800">
                              <strong>{selectedLocations.length}</strong> location(s) selected
                              {primaryLocationId && (
                                <span className="ml-2">
                                  • Primary: {locations.find(l => l.id === primaryLocationId)?.name}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              These locations will be assigned to the facility when you save
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Required Field Indicator */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">* Required</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FacilityModal

