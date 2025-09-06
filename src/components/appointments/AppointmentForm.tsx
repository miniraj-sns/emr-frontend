import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Building2 } from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import { facilityService } from '../../services/facilityService';
import { Facility, Location } from '../../types/appointment';

interface AppointmentFormProps {
  patientId: number;
  onSubmit: (appointmentData: any) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ patientId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patient_id: patientId,
    facility_id: '',
    location_id: '',
    scheduled_at: '',
    duration_minutes: 60,
    type: 'coaching' as const,
    notes: ''
  });

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load facilities on component mount
  useEffect(() => {
    loadFacilities();
  }, []);

  // Load locations when facility changes
  useEffect(() => {
    if (formData.facility_id) {
      loadFacilityLocations(parseInt(formData.facility_id));
    } else {
      setLocations([]);
      setFormData(prev => ({ ...prev, location_id: '' }));
    }
  }, [formData.facility_id]);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      const response = await facilityService.getFacilities({ status: 'active' });
      setFacilities(response.facilities);
    } catch (error) {
      console.error('Error loading facilities:', error);
      setErrors({ general: 'Failed to load facilities' });
    } finally {
      setLoading(false);
    }
  };

  const loadFacilityLocations = async (facilityId: number) => {
    try {
      setLoadingLocations(true);
      const response = await appointmentService.getFacilityLocations(facilityId);
      setLocations(response.locations);
    } catch (error) {
      console.error('Error loading facility locations:', error);
      setErrors({ location: 'Failed to load locations for this facility' });
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.facility_id) {
      setErrors({ facility: 'Please select a facility' });
      return;
    }
    if (!formData.location_id) {
      setErrors({ location: 'Please select a location' });
      return;
    }
    if (!formData.scheduled_at) {
      setErrors({ scheduled_at: 'Please select appointment date and time' });
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating appointment:', error);
      setErrors({ general: 'Failed to create appointment' });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Calendar className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Book New Appointment</h2>
      </div>

      {/* Error Display */}
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Facility Selection */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
            <Building2 className="h-5 w-5 text-blue-600 mr-2" />
            Step 1: Select Facility
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facility *
            </label>
            <select
              value={formData.facility_id}
              onChange={(e) => handleInputChange('facility_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.facility ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="">Select a facility...</option>
              {facilities.map((facility) => (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
                </option>
              ))}
            </select>
            {errors.facility && <p className="text-red-600 text-sm mt-1">{errors.facility}</p>}
            {loading && <p className="text-gray-500 text-sm mt-1">Loading facilities...</p>}
          </div>
        </div>

        {/* Step 2: Location Selection */}
        {formData.facility_id && (
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <MapPin className="h-5 w-5 text-green-600 mr-2" />
              Step 2: Select Location
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <select
                value={formData.location_id}
                onChange={(e) => handleInputChange('location_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loadingLocations || locations.length === 0}
              >
                <option value="">
                  {loadingLocations ? 'Loading locations...' : 'Select a location...'}
                </option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                    {location.city && location.state && ` - ${location.city}, ${location.state}`}
                    {!location.city && ` (${location.location_type})`}
                  </option>
                ))}
              </select>
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
              {loadingLocations && <p className="text-gray-500 text-sm mt-1">Loading locations...</p>}
              {!loadingLocations && locations.length === 0 && (
                <p className="text-gray-500 text-sm mt-1">No locations available for this facility</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Appointment Details */}
        {formData.location_id && (
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Calendar className="h-5 w-5 text-purple-600 mr-2" />
              Step 3: Appointment Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.scheduled_at ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {errors.scheduled_at && <p className="text-red-600 text-sm mt-1">{errors.scheduled_at}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="coaching">Coaching</option>
                <option value="onboarding">Onboarding</option>
                <option value="support">Support</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional notes for this appointment..."
              />
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className={`flex items-center ${formData.facility_id ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                formData.facility_id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {formData.facility_id ? '✓' : '1'}
              </div>
              Facility Selected
            </div>
            <div className={`flex items-center ${formData.location_id ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                formData.location_id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {formData.location_id ? '✓' : '2'}
              </div>
              Location Selected
            </div>
            <div className={`flex items-center ${formData.scheduled_at ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                formData.scheduled_at ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {formData.scheduled_at ? '✓' : '3'}
              </div>
              Details Complete
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.facility_id || !formData.location_id || !formData.scheduled_at}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;





