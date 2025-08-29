import React, { useState } from 'react'
import { 
  MessageSquare, 
  Plus, 
  X 
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'

interface PatientNotesProps {
  patient: Patient
  onNoteAdded: () => void
}

const PatientNotes: React.FC<PatientNotesProps> = ({ patient, onNoteAdded }) => {
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [noteForm, setNoteForm] = useState({
    content: '',
    type: 'general',
    is_provider_visible: false
  })
  const [isAddingNote, setIsAddingNote] = useState(false)

  const handleAddNote = async () => {
    if (!patient || !noteForm.content.trim()) {
      return
    }

    setIsAddingNote(true)
    try {
      // Import the patientService to add note
      const { patientService } = await import('../../services/patientService')
      await patientService.createPatientNote(patient.id, {
        content: noteForm.content,
        type: noteForm.type,
        is_provider_visible: noteForm.is_provider_visible
      })
      
      // Reset form and close modal
      setNoteForm({
        content: '',
        type: 'general',
        is_provider_visible: false
      })
      setShowAddNoteModal(false)
      onNoteAdded()
    } catch (error) {
      console.error('Failed to add note:', error)
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleQuickNote = async () => {
    if (!patient || !noteForm.content.trim()) {
      return
    }

    setIsAddingNote(true)
    try {
      const { patientService } = await import('../../services/patientService')
      await patientService.createPatientNote(patient.id, {
        content: noteForm.content,
        type: 'quick',
        is_provider_visible: false
      })
      
      // Reset form
      setNoteForm({
        content: '',
        type: 'general',
        is_provider_visible: false
      })
      onNoteAdded()
    } catch (error) {
      console.error('Failed to add quick note:', error)
    } finally {
      setIsAddingNote(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Patient Notes */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Patient Notes
          </h2>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowAddNoteModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
        <div className="space-y-4">
          {patient.patient_notes?.map((note: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {note.type || 'General'}
                  </span>
                  {note.is_provider_visible && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Provider Visible
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(note.created_at).toLocaleDateString()} by {note.author?.first_name} {note.author?.last_name}
                </p>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
          {(!patient.patient_notes || patient.patient_notes.length === 0) && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notes available for this patient</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Notes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Notes</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Add a quick note..."
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button 
              size="sm" 
              onClick={handleQuickNote}
              disabled={isAddingNote || !noteForm.content.trim()}
            >
              {isAddingNote ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Patient Note</h3>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Type
                </label>
                <select
                  value={noteForm.type}
                  onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="general">General</option>
                  <option value="medical">Medical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="progress">Progress</option>
                  <option value="concern">Concern</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Content
                </label>
                <textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your note here..."
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="provider-visible"
                  checked={noteForm.is_provider_visible}
                  onChange={(e) => setNoteForm({ ...noteForm, is_provider_visible: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="provider-visible" className="ml-2 block text-sm text-gray-700">
                  Make visible to provider
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddNoteModal(false)}
                disabled={isAddingNote}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNote}
                disabled={isAddingNote || !noteForm.content.trim()}
              >
                {isAddingNote ? 'Adding...' : 'Add Note'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientNotes
