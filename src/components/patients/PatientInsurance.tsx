import React, { useState, useEffect } from 'react'
import { 
  Shield,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  Calendar,
  User,
  CreditCard,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'
import insuranceService, {
  PatientInsurance as InsuranceData,
  CreatePatientInsuranceRequest,
  UpdatePatientInsuranceRequest,
  InsuranceCompany
} from '../../services/insuranceService'
import InsuranceModal from './InsuranceModal'

interface PatientInsuranceProps {
  patient: Patient
  onInsuranceUpdated: () => void
}

const PatientInsurance: React.FC<PatientInsuranceProps> = ({ patient, onInsuranceUpdated }) => {
  // Data states
  const [insurances, setInsurances] = useState<InsuranceData[]>([])
  const [primaryInsurance, setPrimaryInsurance] = useState<InsuranceData | null>(null)
  const [secondaryInsurance, setSecondaryInsurance] = useState<InsuranceData | null>(null)
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([])
  
  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [showInsuranceModal, setShowInsuranceModal] = useState(false)
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceData | null>(null)
  const [modalType, setModalType] = useState<'primary' | 'secondary'>('primary')

  // Load insurance data when patient changes
  useEffect(() => {
    if (patient.id) {
      loadInsuranceData()
      loadInsuranceCompanies()
    }
  }, [patient.id])

  const loadInsuranceData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await insuranceService.getPatientInsurances(patient.id)
      setInsurances(response.insurances || [])
      setPrimaryInsurance(response.primary || null)
      setSecondaryInsurance(response.secondary || null)
    } catch (err) {
      console.error('Error loading insurance data:', err)
      setError('Failed to load insurance data')
    } finally {
      setLoading(false)
    }
  }

  const loadInsuranceCompanies = async () => {
    try {
      const companies = await insuranceService.getInsuranceCompanies({ active: true })
      setInsuranceCompanies(companies)
    } catch (err) {
      console.error('Error loading insurance companies:', err)
    }
  }

  const handleAddInsurance = (type: 'primary' | 'secondary') => {
    setSelectedInsurance(null)
    setModalType(type)
    setShowInsuranceModal(true)
  }

  const handleEditInsurance = (insurance: InsuranceData) => {
    setSelectedInsurance(insurance)
    setModalType(insurance.type)
    setShowInsuranceModal(true)
  }

  const handleModalClose = () => {
    setShowInsuranceModal(false)
    setSelectedInsurance(null)
  }

  const handleDeleteInsurance = async (insurance: InsuranceData) => {
    if (!confirm('Are you sure you want to delete this insurance record? This action cannot be undone.')) {
      return
    }

    try {
      await insuranceService.deletePatientInsurance(patient.id, insurance.id)
      await loadInsuranceData()
      onInsuranceUpdated()
    } catch (err) {
      console.error('Error deleting insurance:', err)
      setError('Failed to delete insurance')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'inactive':
        return 'text-gray-600 bg-gray-100'
      case 'expired':
        return 'text-red-600 bg-red-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading insurance data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-center py-6">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={loadInsuranceData}
              className="mt-3"
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Primary Insurance */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Primary Insurance
          </h2>
          <div className="flex items-center space-x-2">
            {primaryInsurance && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditInsurance(primaryInsurance)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => handleDeleteInsurance(primaryInsurance)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAddInsurance('primary')}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {primaryInsurance ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
              <Shield className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Provider</p>
                <p className="text-sm font-medium">{primaryInsurance.insurance_company?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Policy Number</p>
                <p className="text-sm font-medium">{primaryInsurance.policy_number}</p>
              </div>
            </div>
            
            {primaryInsurance.group_number && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Group Number</p>
                  <p className="text-sm font-medium">{primaryInsurance.group_number}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Effective Date</p>
                <p className="text-sm font-medium">{formatDate(primaryInsurance.effective_date)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No primary insurance</p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAddInsurance('primary')}
              className="mt-2"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Primary Insurance
            </Button>
          </div>
        )}
      </div>

      {/* Secondary Insurance */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Secondary Insurance
          </h2>
          <div className="flex items-center space-x-2">
            {secondaryInsurance && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditInsurance(secondaryInsurance)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => handleDeleteInsurance(secondaryInsurance)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAddInsurance('secondary')}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {secondaryInsurance ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
              <Shield className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Provider</p>
                <p className="text-sm font-medium">{secondaryInsurance.insurance_company?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Policy Number</p>
                <p className="text-sm font-medium">{secondaryInsurance.policy_number}</p>
              </div>
            </div>
            
            {secondaryInsurance.group_number && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Group Number</p>
                  <p className="text-sm font-medium">{secondaryInsurance.group_number}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Effective Date</p>
                <p className="text-sm font-medium">{formatDate(secondaryInsurance.effective_date)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No secondary insurance</p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAddInsurance('secondary')}
              className="mt-2"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Secondary Insurance
            </Button>
          </div>
        )}
      </div>

      {/* Billing Information */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Billing Information
          </h2>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-md">
            <TrendingDown className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-blue-600">Current Balance</p>
              <p className="text-sm font-medium text-blue-700">$0.00</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-md">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-green-600">Insurance Paid</p>
              <p className="text-sm font-medium text-green-700">$0.00</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-md">
            <DollarSign className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-orange-600">Patient Paid</p>
              <p className="text-sm font-medium text-orange-700">$0.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance History */}
      {insurances.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Insurance History ({insurances.length})
            </h2>
          </div>
          
          <div className="space-y-2">
            {insurances.slice(0, 3).map((insurance) => (
              <div key={insurance.id} className="border border-gray-200 rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {insurance.insurance_company?.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(insurance.status)}`}>
                      {insurance.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditInsurance(insurance)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleDeleteInsurance(insurance)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Type:</span> {insurance.type}
                  </div>
                  <div>
                    <span className="font-medium">Policy:</span> {insurance.policy_number}
                  </div>
                  <div>
                    <span className="font-medium">Effective:</span> {formatDate(insurance.effective_date)}
                  </div>
                  {insurance.copay_amount && (
                    <div>
                      <span className="font-medium">Copay:</span> {formatCurrency(insurance.copay_amount)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insurance Modal */}
      <InsuranceModal
        isOpen={showInsuranceModal}
        onClose={handleModalClose}
        patientId={patient.id}
        insurance={selectedInsurance}
        type={modalType}
        insuranceCompanies={insuranceCompanies}
        onSave={async (data) => {
          try {
            if (selectedInsurance) {
              await insuranceService.updatePatientInsurance(patient.id, selectedInsurance.id, data as UpdatePatientInsuranceRequest)
            } else {
              await insuranceService.createPatientInsurance(patient.id, data as CreatePatientInsuranceRequest)
            }
            await loadInsuranceData()
            handleModalClose()
            onInsuranceUpdated()
          } catch (err) {
            console.error('Error saving insurance:', err)
            throw err
          }
        }}
      />
    </div>
  )
}

export default PatientInsurance
