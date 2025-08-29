import React, { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import { 
  PatientMedicalProblem, 
  CreatePatientMedicalProblemRequest, 
  UpdatePatientMedicalProblemRequest 
} from '../../services/patientMasterDataService'
import masterDataService from '../../services/masterDataService'

interface MedicalProblemModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: number
  medicalProblem?: PatientMedicalProblem | null
  onSave: (data: CreatePatientMedicalProblemRequest | UpdatePatientMedicalProblemRequest) => Promise<void>
  mode: 'add' | 'edit'
}

const MedicalProblemModal: React.FC<MedicalProblemModalProps> = ({ 
  isOpen, 
  onClose, 
  patientId, 
  medicalProblem, 
  onSave, 
  mode 
}) => {
  const [formData, setFormData] = useState<CreatePatientMedicalProblemRequest>({
    master_medical_problem_id: 0,
    severity: 'moderate',
    diagnosis_date: '',
    notes: ''
  })
  const [availableProblems, setAvailableProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingProblems, setLoadingProblems] = useState(false)

  // Load available medical problems when modal opens
  useEffect(() => {
    if (isOpen && mode === 'add') {
      loadAvailableProblems()
    }
  }, [isOpen, mode, patientId])

  // Set form data when editing
  useEffect(() => {
    if (medicalProblem && mode === 'edit') {
      // Format the diagnosis_date for HTML date input (YYYY-MM-DD)
      const formatDate = (dateString: string | undefined) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }

      setFormData({
        master_medical_problem_id: medicalProblem.master_medical_problem_id,
        severity: medicalProblem.severity,
        diagnosis_date: formatDate(medicalProblem.diagnosis_date),
        notes: medicalProblem.notes || ''
      })
    } else {
      setFormData({
        master_medical_problem_id: 0,
        severity: 'moderate',
        diagnosis_date: '',
        notes: ''
      })
    }
  }, [medicalProblem, mode])

  const loadAvailableProblems = async () => {
    setLoadingProblems(true)
    try {
      const response = await masterDataService.getMedicalProblems({ per_page: 100 })
      setAvailableProblems(response.data)
    } catch (error) {
      console.error('Error loading medical problems:', error)
    } finally {
      setLoadingProblems(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.master_medical_problem_id) return

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving medical problem:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      master_medical_problem_id: 0,
      severity: 'moderate',
      diagnosis_date: '',
      notes: ''
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'add' ? 'Add Medical Problem' : 'Edit Medical Problem'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Master Medical Problem Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medical Problem *
          </label>
          {mode === 'add' ? (
            <select
              value={formData.master_medical_problem_id}
              onChange={(e) => setFormData(prev => ({ ...prev, master_medical_problem_id: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loadingProblems}
            >
              <option value={0}>Select Medical Problem</option>
              {availableProblems.map((problem) => (
                <option key={problem.id} value={problem.id}>
                  {problem.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={medicalProblem?.master_medical_problem?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          )}
          {loadingProblems && (
            <p className="text-xs text-gray-500 mt-1">Loading medical problems...</p>
          )}
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity *
          </label>
          <select
            value={formData.severity}
            onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>

        {/* Diagnosis Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diagnosis Date
          </label>
          <input
            type="date"
            value={formData.diagnosis_date || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, diagnosis_date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes about the medical problem"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.master_medical_problem_id}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {mode === 'add' ? 'Add Medical Problem' : 'Update Medical Problem'}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default MedicalProblemModal
