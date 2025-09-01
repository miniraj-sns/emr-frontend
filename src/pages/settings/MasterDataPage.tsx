import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Heart, 
  Pill,
  ChevronDown,
  ChevronRight,
  Save,
  X,
  Loader2,
  Shield,
  FileText
} from 'lucide-react'
import masterDataService, { 
  MasterAllergy, 
  MasterMedicalProblem, 
  MasterMedication 
} from '../../services/masterDataService'
import prescriptionService, {
  MasterUnit,
  MasterRoute,
  MasterInterval
} from '../../services/prescriptionService'
import insuranceService, {
  InsuranceCompany
} from '../../services/insuranceService'
import {
  DocumentType,
  getDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType
} from '../../services/documentTypeService'

interface MasterDataSection {
  title: string
  icon: React.ComponentType<any>
  color: string
  type: 'allergies' | 'medical-problems' | 'medications' | 'units' | 'routes' | 'intervals' | 'insurance-companies' | 'document-types'
}

const MasterDataPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['allergies', 'medical-problems', 'medications', 'units', 'routes', 'intervals', 'insurance-companies', 'document-types'])
  const [editingItem, setEditingItem] = useState<{ section: string; id: string } | null>(null)
  const [editingValues, setEditingValues] = useState<{ name: string; description: string; code?: string; phone?: string }>({ name: '', description: '' })
  const [newItem, setNewItem] = useState<{ name: string; description: string; code?: string; phone?: string }>({ name: '', description: '' })
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  // Data from API
  const [allergies, setAllergies] = useState<MasterAllergy[]>([])
  const [medicalProblems, setMedicalProblems] = useState<MasterMedicalProblem[]>([])
  const [medications, setMedications] = useState<MasterMedication[]>([])
  const [units, setUnits] = useState<MasterUnit[]>([])
  const [routes, setRoutes] = useState<MasterRoute[]>([])
  const [intervals, setIntervals] = useState<MasterInterval[]>([])
  const [insuranceCompanies, setInsuranceCompanies] = useState<InsuranceCompany[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])

  const masterData: Record<string, MasterDataSection> = {
    allergies: {
      title: 'Allergies',
      icon: AlertTriangle,
      color: 'red',
      type: 'allergies'
    },
    'medical-problems': {
      title: 'Medical Problems',
      icon: Heart,
      color: 'blue',
      type: 'medical-problems'
    },
    medications: {
      title: 'Medications',
      icon: Pill,
      color: 'green',
      type: 'medications'
    },
    units: {
      title: 'Units',
      icon: Pill,
      color: 'purple',
      type: 'units'
    },
    routes: {
      title: 'Routes',
      icon: Pill,
      color: 'orange',
      type: 'routes'
    },
    intervals: {
      title: 'Intervals',
      icon: Pill,
      color: 'teal',
      type: 'intervals'
    },
    'insurance-companies': {
      title: 'Insurance Companies',
      icon: Shield,
      color: 'indigo',
      type: 'insurance-companies'
    },
    'document-types': {
      title: 'Document Types',
      icon: FileText,
      color: 'cyan',
      type: 'document-types'
    }
  }

  // Load data from API
  useEffect(() => {
    loadAllergies()
    loadMedicalProblems()
    loadMedications()
    loadUnits()
    loadRoutes()
    loadIntervals()
    loadInsuranceCompanies()
    loadDocumentTypes()
  }, [])

  const loadAllergies = async () => {
    setLoading(prev => ({ ...prev, allergies: true }))
    try {
      const response = await masterDataService.getAllergies({ per_page: 100 })
      setAllergies(response.data)
    } catch (err) {
      setError('Failed to load allergies')
      console.error('Error loading allergies:', err)
    } finally {
      setLoading(prev => ({ ...prev, allergies: false }))
    }
  }

  const loadMedicalProblems = async () => {
    setLoading(prev => ({ ...prev, 'medical-problems': true }))
    try {
      const response = await masterDataService.getMedicalProblems({ per_page: 100 })
      setMedicalProblems(response.data)
    } catch (err) {
      setError('Failed to load medical problems')
      console.error('Error loading medical problems:', err)
    } finally {
      setLoading(prev => ({ ...prev, 'medical-problems': false }))
    }
  }

  const loadMedications = async () => {
    setLoading(prev => ({ ...prev, medications: true }))
    try {
      const response = await masterDataService.getMedications({ per_page: 100 })
      setMedications(response.data)
    } catch (err) {
      setError('Failed to load medications')
      console.error('Error loading medications:', err)
    } finally {
      setLoading(prev => ({ ...prev, medications: false }))
    }
  }

  const loadUnits = async () => {
    setLoading(prev => ({ ...prev, units: true }))
    try {
      const response = await prescriptionService.getMasterUnits()
      // Handle both paginated and direct array responses
      const unitsData = response.data?.data || response.data || []
      setUnits(unitsData)
    } catch (err) {
      setError('Failed to load units')
      console.error('Error loading units:', err)
      setUnits([])
    } finally {
      setLoading(prev => ({ ...prev, units: false }))
    }
  }

  const loadRoutes = async () => {
    setLoading(prev => ({ ...prev, routes: true }))
    try {
      const response = await prescriptionService.getMasterRoutes()
      // Handle both paginated and direct array responses
      const routesData = response.data?.data || response.data || []
      setRoutes(routesData)
    } catch (err) {
      setError('Failed to load routes')
      console.error('Error loading routes:', err)
      setRoutes([])
    } finally {
      setLoading(prev => ({ ...prev, routes: false }))
    }
  }

  const loadIntervals = async () => {
    setLoading(prev => ({ ...prev, intervals: true }))
    try {
      const response = await prescriptionService.getMasterIntervals()
      // Handle both paginated and direct array responses
      const intervalsData = response.data?.data || response.data || []
      setIntervals(intervalsData)
    } catch (err) {
      setError('Failed to load intervals')
      console.error('Error loading intervals:', err)
      setIntervals([])
    } finally {
      setLoading(prev => ({ ...prev, intervals: false }))
    }
  }

  const loadInsuranceCompanies = async () => {
    setLoading(prev => ({ ...prev, 'insurance-companies': true }))
    try {
      const response = await insuranceService.getInsuranceCompanies()
      setInsuranceCompanies(response)
    } catch (err) {
      setError('Failed to load insurance companies')
      console.error('Error loading insurance companies:', err)
      setInsuranceCompanies([])
    } finally {
      setLoading(prev => ({ ...prev, 'insurance-companies': false }))
    }
  }

  const loadDocumentTypes = async () => {
    setLoading(prev => ({ ...prev, 'document-types': true }))
    try {
      const response = await getDocumentTypes()
      setDocumentTypes(response)
    } catch (err) {
      setError('Failed to load document types')
      console.error('Error loading document types:', err)
      setDocumentTypes([])
    } finally {
      setLoading(prev => ({ ...prev, 'document-types': false }))
    }
  }

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    )
  }

  // Check for duplicate names
  const isDuplicateName = (sectionKey: string, name: string, excludeId?: number) => {
    const items = getItemsForSection(sectionKey)
    return items.some(item => 
      item.name.toLowerCase() === name.toLowerCase() && item.id !== excludeId
    )
  }

  const handleAddItem = async (sectionKey: string) => {
    if (!newItem.name.trim()) return

    // Check for duplicate names
    if (isDuplicateName(sectionKey, newItem.name)) {
      setError(`A ${masterData[sectionKey].title.toLowerCase().slice(0, -1)} with this name already exists`)
      return
    }

    try {
      const section = masterData[sectionKey]
      let response

      switch (section.type) {
        case 'allergies':
          response = await masterDataService.createAllergy({
            name: newItem.name,
            description: newItem.description,
            severity: 'moderate',
            is_active: true
          })
          setAllergies(prev => [...prev, response.data])
          break
        case 'medical-problems':
          response = await masterDataService.createMedicalProblem({
            name: newItem.name,
            description: newItem.description,
            severity: 'moderate',
            is_active: true
          })
          setMedicalProblems(prev => [...prev, response.data])
          break
        case 'medications':
          response = await masterDataService.createMedication({
            name: newItem.name,
            description: newItem.description,
            is_active: true
          })
          setMedications(prev => [...prev, response.data])
          break
        case 'units':
          response = await prescriptionService.createMasterUnit({
            name: newItem.name,
            code: newItem.name.toLowerCase().replace(/\s+/g, '-'),
            description: newItem.description,
            is_active: true
          })
          setUnits(prev => [...prev, response.data])
          break
        case 'routes':
          response = await prescriptionService.createMasterRoute({
            name: newItem.name,
            code: newItem.name.toLowerCase().replace(/\s+/g, '-'),
            description: newItem.description,
            is_active: true
          })
          setRoutes(prev => [...prev, response.data])
          break
        case 'intervals':
          response = await prescriptionService.createMasterInterval({
            name: newItem.name,
            code: newItem.name.toLowerCase().replace(/\s+/g, '-'),
            description: newItem.description,
            is_active: true
          })
          setIntervals(prev => [...prev, response.data])
          break
        case 'insurance-companies':
          response = await insuranceService.createInsuranceCompany({
            name: newItem.name,
            code: newItem.code || newItem.name.toLowerCase().replace(/\s+/g, '-').substring(0, 50),
            phone: newItem.phone,
            notes: newItem.description,
            is_active: true
          })
          setInsuranceCompanies(prev => [...prev, response])
          break
        case 'document-types':
          response = await createDocumentType({
            name: newItem.name,
            code: newItem.code || newItem.name.toLowerCase().replace(/\s+/g, '-').substring(0, 50),
            description: newItem.description,
            icon: 'file-text',
            color: 'blue',
            is_active: true
          })
          setDocumentTypes(prev => [...prev, response])
          break
      }

      setNewItem({ name: '', description: '', code: '', phone: '' })
      setActiveSection(null)
      setError(null)
    } catch (err) {
      setError('Failed to add item')
      console.error('Error adding item:', err)
    }
  }

  const handleEditItem = async (sectionKey: string, itemId: number, updatedName: string, updatedDescription: string) => {
    if (!updatedName.trim()) return

    // Check for duplicate names
    if (isDuplicateName(sectionKey, updatedName, itemId)) {
      setError(`A ${masterData[sectionKey].title.toLowerCase().slice(0, -1)} with this name already exists`)
      return
    }

    try {
      const section = masterData[sectionKey]
      let response

      switch (section.type) {
        case 'allergies':
          response = await masterDataService.updateAllergy(itemId, {
            name: updatedName,
            description: updatedDescription,
            severity: 'moderate' // Include required severity field
          })
          setAllergies(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'medical-problems':
          response = await masterDataService.updateMedicalProblem(itemId, {
            name: updatedName,
            description: updatedDescription,
            severity: 'moderate' // Include required severity field
          })
          setMedicalProblems(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'medications':
          response = await masterDataService.updateMedication(itemId, {
            name: updatedName,
            description: updatedDescription
          })
          setMedications(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'units':
          response = await prescriptionService.updateMasterUnit(itemId, {
            name: updatedName,
            code: updatedName.toLowerCase().replace(/\s+/g, '-'),
            description: updatedDescription
          })
          setUnits(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'routes':
          response = await prescriptionService.updateMasterRoute(itemId, {
            name: updatedName,
            code: updatedName.toLowerCase().replace(/\s+/g, '-'),
            description: updatedDescription
          })
          setRoutes(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'intervals':
          response = await prescriptionService.updateMasterInterval(itemId, {
            name: updatedName,
            code: updatedName.toLowerCase().replace(/\s+/g, '-'),
            description: updatedDescription
          })
          setIntervals(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'insurance-companies':
          response = await insuranceService.updateInsuranceCompany(itemId, {
            name: updatedName,
            code: editingValues.code || updatedName.toLowerCase().replace(/\s+/g, '-').substring(0, 50),
            phone: editingValues.phone,
            notes: updatedDescription
          })
          setInsuranceCompanies(prev => prev.map(item => item.id === itemId ? response : item))
          break
        case 'document-types':
          response = await updateDocumentType(itemId, {
            name: updatedName,
            code: editingValues.code || updatedName.toLowerCase().replace(/\s+/g, '-').substring(0, 50),
            description: updatedDescription,
            icon: 'file-text',
            color: 'blue'
          })
          setDocumentTypes(prev => prev.map(item => item.id === itemId ? response : item))
          break
      }

      setEditingItem(null)
      setEditingValues({ name: '', description: '' })
      setError(null)
    } catch (err) {
      setError('Failed to update item')
      console.error('Error updating item:', err)
    }
  }

  const handleDeleteItem = async (sectionKey: string, itemId: number) => {
    try {
      const section = masterData[sectionKey]

      switch (section.type) {
        case 'allergies':
          await masterDataService.deleteAllergy(itemId)
          setAllergies(prev => prev.filter(item => item.id !== itemId))
          break
        case 'medical-problems':
          await masterDataService.deleteMedicalProblem(itemId)
          setMedicalProblems(prev => prev.filter(item => item.id !== itemId))
          break
        case 'medications':
          await masterDataService.deleteMedication(itemId)
          setMedications(prev => prev.filter(item => item.id !== itemId))
          break
        case 'units':
          await prescriptionService.deleteMasterUnit(itemId)
          setUnits(prev => prev.filter(item => item.id !== itemId))
          break
        case 'routes':
          await prescriptionService.deleteMasterRoute(itemId)
          setRoutes(prev => prev.filter(item => item.id !== itemId))
          break
        case 'intervals':
          await prescriptionService.deleteMasterInterval(itemId)
          setIntervals(prev => prev.filter(item => item.id !== itemId))
          break
        case 'insurance-companies':
          await insuranceService.deleteInsuranceCompany(itemId)
          setInsuranceCompanies(prev => prev.filter(item => item.id !== itemId))
          break
        case 'document-types':
          await deleteDocumentType(itemId)
          setDocumentTypes(prev => prev.filter(item => item.id !== itemId))
          break
      }
    } catch (err) {
      setError('Failed to delete item')
      console.error('Error deleting item:', err)
    }
  }

  const toggleItemStatus = async (sectionKey: string, itemId: number) => {
    try {
      const section = masterData[sectionKey]
      let response

      switch (section.type) {
        case 'allergies':
          response = await masterDataService.toggleAllergyStatus(itemId)
          setAllergies(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'medical-problems':
          response = await masterDataService.toggleMedicalProblemStatus(itemId)
          setMedicalProblems(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'medications':
          response = await masterDataService.toggleMedicationStatus(itemId)
          setMedications(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'units':
          response = await prescriptionService.toggleMasterUnitStatus(itemId)
          setUnits(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'routes':
          response = await prescriptionService.toggleMasterRouteStatus(itemId)
          setRoutes(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'intervals':
          response = await prescriptionService.toggleMasterIntervalStatus(itemId)
          setIntervals(prev => prev.map(item => item.id === itemId ? response.data : item))
          break
        case 'insurance-companies':
          // For insurance companies, we'll update the is_active status directly
          const currentItem = insuranceCompanies.find(item => item.id === itemId)
          if (currentItem) {
            response = await insuranceService.updateInsuranceCompany(itemId, {
              ...currentItem,
              is_active: !currentItem.is_active
            })
            setInsuranceCompanies(prev => prev.map(item => item.id === itemId ? response : item))
          }
          break
        case 'document-types':
          // For document types, we'll update the is_active status directly
          const currentDocType = documentTypes.find(item => item.id === itemId)
          if (currentDocType) {
            response = await updateDocumentType(itemId, {
              ...currentDocType,
              is_active: !currentDocType.is_active
            })
            setDocumentTypes(prev => prev.map(item => item.id === itemId ? response : item))
          }
          break
      }
    } catch (err) {
      setError('Failed to toggle item status')
      console.error('Error toggling item status:', err)
    }
  }

  const startEditing = (item: any, sectionKey: string) => {
    setEditingItem({ section: sectionKey, id: item.id.toString() })
    setEditingValues({ 
      name: item.name, 
      description: item.description || item.notes || '',
      code: item.code || '',
      phone: item.phone || ''
    })
  }

  const cancelEditing = () => {
    setEditingItem(null)
    setEditingValues({ name: '', description: '', code: '', phone: '' })
    setError(null)
  }

  const getItemsForSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'allergies':
        return allergies || []
      case 'medical-problems':
        return medicalProblems || []
      case 'medications':
        return medications || []
      case 'units':
        return units || []
      case 'routes':
        return routes || []
      case 'intervals':
        return intervals || []
              case 'insurance-companies':
          return insuranceCompanies
        case 'document-types':
          return documentTypes || []
      default:
        return []
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Master Data Configuration</h1>
        <p className="text-sm text-gray-600">Manage system-wide reference data</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Master Data Sets</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure standard reference data used throughout the system
          </p>
        </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {Object.entries(masterData).map(([sectionKey, section]) => {
             const Icon = section.icon
             const isExpanded = expandedSections.includes(sectionKey)
             const isActive = activeSection === sectionKey

             return (
               <div key={sectionKey} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                 <div className="p-4 border-b border-gray-200">
                   <button
                     onClick={() => toggleSection(sectionKey)}
                     className="w-full flex items-center justify-between text-left"
                   >
                     <div className="flex items-center space-x-3">
                       <div className={`p-2 rounded-lg bg-${section.color}-100`}>
                         <Icon className={`h-5 w-5 text-${section.color}-600`} />
                       </div>
                       <div>
                         <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                         <p className="text-sm text-gray-600">
                           {loading[sectionKey] ? (
                             <Loader2 className="w-4 h-4 animate-spin inline" />
                           ) : (
                             `${getItemsForSection(sectionKey).length} items configured`
                           )}
                         </p>
                       </div>
                     </div>
                     {isExpanded ? (
                       <ChevronDown className="h-5 w-5 text-gray-400" />
                     ) : (
                       <ChevronRight className="h-5 w-5 text-gray-400" />
                     )}
                   </button>
                 </div>

                                   {isExpanded && (
                    <div className="p-4 space-y-4">
                      {/* Add New Item Form */}
                      {isActive ? (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder={`Add new ${section.title.toLowerCase()}...`}
                              value={newItem.name}
                              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                              type="text"
                              placeholder="Description (optional)"
                              value={newItem.description}
                              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            
                            {/* Additional fields for insurance companies */}
                            {sectionKey === 'insurance-companies' && (
                              <>
                                <input
                                  type="text"
                                  placeholder="Code (e.g., BCBS)"
                                  value={newItem.code || ''}
                                  onChange={(e) => setNewItem(prev => ({ ...prev, code: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <input
                                  type="text"
                                  placeholder="Phone (e.g., 1-800-123-4567)"
                                  value={newItem.phone || ''}
                                  onChange={(e) => setNewItem(prev => ({ ...prev, phone: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </>
                            )}
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAddItem(sectionKey)}
                                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setActiveSection(null)
                                  setNewItem({ name: '', description: '', code: '', phone: '' })
                                }}
                                className="px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              setActiveSection(sectionKey)
                              setNewItem({ name: '', description: '', code: '', phone: '' })
                            }}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add New {section.title.slice(0, -1)}</span>
                          </button>
                        </div>
                      )}

                      {/* Items List with Scrollable Container */}
                      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                        {loading[sectionKey] ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            <span className="ml-2 text-sm text-gray-600">Loading...</span>
                          </div>
                        ) : (
                          <div className="p-3 space-y-2">
                            {getItemsForSection(sectionKey).map((item) => (
                              <div
                                key={item.id}
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">
                                      {item.name}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <button
                                      onClick={() => toggleItemStatus(sectionKey, item.id)}
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        item.is_active
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}
                                    >
                                      {item.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                    <button
                                      onClick={() => startEditing(item, sectionKey)}
                                      className="text-blue-600 hover:text-blue-900"
                                      title="Edit"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem(sectionKey, item.id)}
                                      className="text-red-600 hover:text-red-900"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="text-xs text-gray-500">
                                  {item.description || item.notes || 'No description'}
                                </div>
                                
                                {/* Show code and phone for insurance companies */}
                                {sectionKey === 'insurance-companies' && (
                                  <div className="text-xs text-gray-400 mt-1 space-y-1">
                                    {item.code && (
                                      <div>Code: {item.code}</div>
                                    )}
                                    {item.phone && (
                                      <div>Phone: {item.phone}</div>
                                    )}
                                  </div>
                                )}

                                {/* Edit Form - Hidden by default */}
                                {editingItem?.section === sectionKey && editingItem?.id === item.id.toString() && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded-lg space-y-2">
                                    <input
                                      type="text"
                                      value={editingValues.name}
                                      onChange={(e) => setEditingValues(prev => ({ ...prev, name: e.target.value }))}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      placeholder="Name"
                                    />
                                    <input
                                      type="text"
                                      value={editingValues.description}
                                      onChange={(e) => setEditingValues(prev => ({ ...prev, description: e.target.value }))}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      placeholder="Description"
                                    />
                                    
                                    {/* Additional fields for insurance companies */}
                                    {sectionKey === 'insurance-companies' && (
                                      <>
                                        <input
                                          type="text"
                                          value={editingValues.code || ''}
                                          onChange={(e) => setEditingValues(prev => ({ ...prev, code: e.target.value }))}
                                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          placeholder="Code (e.g., BCBS)"
                                        />
                                        <input
                                          type="text"
                                          value={editingValues.phone || ''}
                                          onChange={(e) => setEditingValues(prev => ({ ...prev, phone: e.target.value }))}
                                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          placeholder="Phone (e.g., 1-800-123-4567)"
                                        />
                                      </>
                                    )}
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleEditItem(sectionKey, item.id, editingValues.name, editingValues.description)}
                                        className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={cancelEditing}
                                        className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
               </div>
             )
           })}
         </div>
      </div>
    </div>
  )
}

export default MasterDataPage
