import React from 'react'
import { 
  Shield, 
  CreditCard 
} from 'lucide-react'
import { Patient } from '../../types/patient'

interface PatientInsuranceProps {
  patient: Patient
}

const PatientInsurance: React.FC<PatientInsuranceProps> = ({ patient }) => {
  return (
    <div className="space-y-6">
      {/* Primary Insurance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Primary Insurance
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Provider</label>
              <p className="mt-1 text-sm text-gray-900">{patient.insurance?.primary?.provider}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Policy Number</label>
              <p className="mt-1 text-sm text-gray-900">{patient.insurance?.primary?.policy_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Group Number</label>
              <p className="mt-1 text-sm text-gray-900">{patient.insurance?.primary?.group_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Status</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Insurance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Secondary Insurance
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Provider</label>
              <p className="mt-1 text-sm text-gray-900">{patient.insurance?.secondary?.provider}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Policy Number</label>
              <p className="mt-1 text-sm text-gray-900">{patient.insurance?.secondary?.policy_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Group Number</label>
              <p className="mt-1 text-sm text-gray-900">{patient.insurance?.secondary?.group_number}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Status</label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Billing Information
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">${patient.current_balance?.toFixed(2) || '0'}</p>
              <p className="text-sm text-gray-600">Current Balance</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <p className="text-2xl font-bold text-green-600">${patient.insurance_paid?.toFixed(2) || '0'}</p>
              <p className="text-sm text-gray-600">Insurance Paid</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">${patient.patient_paid?.toFixed(2) || '0'}</p>
              <p className="text-sm text-gray-600">Patient Paid</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientInsurance
