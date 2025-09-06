import React, { useState } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import AppointmentForm from '../../components/appointments/AppointmentForm';

const AppointmentDemoPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  const handleSubmit = async (data: any) => {
    // In a real app, this would call the appointment service
    console.log('Appointment data:', data);
    setAppointmentData(data);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Appointment Booking System</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the new hierarchical booking flow: <strong>Facility → Location → Appointment</strong>
          </p>
        </div>

        {/* Demo Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Select Facility</h3>
              <p className="text-sm text-gray-600">
                Choose from available healthcare facilities in your network
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Choose Location</h3>
              <p className="text-sm text-gray-600">
                Pick a specific location within the selected facility
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Book Appointment</h3>
              <p className="text-sm text-gray-600">
                Schedule your appointment with date, time, and details
              </p>
            </div>
          </div>
        </div>

        {/* Demo Button */}
        {!showForm && !appointmentData && (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium shadow-lg"
            >
              Try the New Booking Flow
            </button>
          </div>
        )}

        {/* Appointment Form */}
        {showForm && (
          <AppointmentForm
            patientId={1} // Demo patient ID
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {/* Success Message */}
        {appointmentData && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Booked Successfully!</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto text-left">
              <h3 className="font-medium text-gray-900 mb-3">Appointment Details:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>Facility ID:</strong> {appointmentData.facility_id}</div>
                <div><strong>Location ID:</strong> {appointmentData.location_id}</div>
                <div><strong>Date & Time:</strong> {new Date(appointmentData.scheduled_at).toLocaleString()}</div>
                <div><strong>Duration:</strong> {appointmentData.duration_minutes} minutes</div>
                <div><strong>Type:</strong> {appointmentData.type}</div>
                {appointmentData.notes && (
                  <div><strong>Notes:</strong> {appointmentData.notes}</div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  setAppointmentData(null);
                  setShowForm(true);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3"
              >
                Book Another Appointment
              </button>
              <button
                onClick={() => setAppointmentData(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset Demo
              </button>
            </div>
          </div>
        )}

        {/* Technical Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Backend Changes</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Added facility_id and location_id to appointments table</li>
                <li>• Created facility-location relationship management</li>
                <li>• Added API endpoint: GET /facilities/{id}/locations</li>
                <li>• Updated appointment validation and storage</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Frontend Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Step-by-step booking flow with progress indicators</li>
                <li>• Dynamic location loading based on facility selection</li>
                <li>• Real-time form validation and error handling</li>
                <li>• Responsive design with clear visual hierarchy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDemoPage;





