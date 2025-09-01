import React, { useState, useEffect } from 'react'
import { 
  FileImage, 
  FileText, 
  Shield, 
  Plus, 
  Eye, 
  Download,
  Upload,
  Edit,
  Trash2,
  Calendar,
  User,
  Filter,
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle,
  X,
  File,
  Image,
  FileCheck,
  CreditCard,
  Syringe,
  Pill,
  Gavel,
  Maximize2,
  Minimize2,
  RotateCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'
import {
  PatientDocument,
  DocumentCategory,
  DocumentType,
  getPatientDocuments,
  uploadDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  getDocumentContent,
  formatFileSize,
  getFileIcon
} from '../../services/patientDocumentService'
import { getDocumentTypes } from '../../services/documentTypeService'

interface PatientDocumentsProps {
  patient: Patient
  onDocumentsUpdated?: () => void
}

const PatientDocuments: React.FC<PatientDocumentsProps> = ({ patient, onDocumentsUpdated }) => {
  const [documents, setDocuments] = useState<PatientDocument[]>([])
  const [categories, setCategories] = useState<DocumentCategory[]>([])
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showViewerModal, setShowViewerModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<PatientDocument | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedType, setSelectedType] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewerZoom, setViewerZoom] = useState(1)
  const [viewerRotation, setViewerRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [textContent, setTextContent] = useState<string>('')
  const [loadingContent, setLoadingContent] = useState(false)

  // Load documents and categories
  const loadDocuments = async () => {
    try {
      setLoading(true)
      const response = await getPatientDocuments(patient.id, { type: filterType === 'all' ? undefined : filterType })
      setDocuments(response.documents)
      setCategories(response.categories)
    } catch (err) {
      console.error('Error loading documents:', err)
      setError('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  // Load document types for upload
  const loadDocumentTypes = async () => {
    try {
      const types = await getDocumentTypes({ active: true })
      setDocumentTypes(types)
    } catch (err) {
      console.error('Error loading document types:', err)
    }
  }

  useEffect(() => {
    loadDocuments()
    loadDocumentTypes()
  }, [patient.id, filterType])

  // Handle file upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedType) {
      setError('Please select a file and document type')
      return
    }

    try {
      setUploading(true)
      await uploadDocument(patient.id, {
        file: selectedFile,
        document_type_id: selectedType as number,
        description: description || undefined
      })
      
      // Reset form
      setSelectedFile(null)
      setSelectedType('')
      setDescription('')
      setShowUploadModal(false)
      
      // Reload documents
      await loadDocuments()
      onDocumentsUpdated?.()
    } catch (err) {
      console.error('Error uploading document:', err)
      setError('Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  // Handle document view
  const handleView = async (document: PatientDocument) => {
    try {
      setSelectedDocument(document)
      setShowViewerModal(true)
      setViewerZoom(1)
      setViewerRotation(0)
      setIsFullscreen(false)
      setTextContent('')
      
      // Load text content if it's a text file
      if (document.mime_type.startsWith('text/')) {
        setLoadingContent(true)
        try {
          const content = await getDocumentContent(patient.id, document.id)
          setTextContent(content)
        } catch (err) {
          console.error('Error loading text content:', err)
          setTextContent('Error loading file content')
        } finally {
          setLoadingContent(false)
        }
      }
    } catch (err) {
      console.error('Error viewing document:', err)
      setError('Failed to open document viewer')
    }
  }

  // Handle document download
  const handleDownload = async (document: PatientDocument) => {
    try {
      const blob = await downloadDocument(patient.id, document.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = document.original_filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading document:', err)
      setError('Failed to download document')
    }
  }

  // Handle document deletion
  const handleDelete = async (document: PatientDocument) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await deleteDocument(patient.id, document.id)
      await loadDocuments()
      onDocumentsUpdated?.()
    } catch (err) {
      console.error('Error deleting document:', err)
      setError('Failed to delete document')
    }
  }

  // Get icon component based on document type
  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'activity': FileText,
      'shield': Shield,
      'gavel': Gavel,
      'pill': Pill,
      'syringe': Syringe,
      'file-check': FileCheck,
      'credit-card': CreditCard,
      'file-text': FileText,
      'image': Image,
      'file': File
    }
    return iconMap[iconName] || FileText
  }

  // Check if document is viewable in browser
  const isViewable = (document: PatientDocument) => {
    const viewableTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'text/plain', 'text/html', 'text/css', 'text/javascript'
    ]
    return viewableTypes.includes(document.mime_type)
  }

  // Get document URL for viewing
  const getDocumentUrl = (document: PatientDocument) => {
    return `http://localhost:8000/storage/${document.file_path}`
  }

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileImage className="h-5 w-5 mr-2" />
            Documents & Files
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
          </Button>
        </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          {categories.map(category => (
            <option key={category.code} value={category.code}>
              {category.name} ({category.count})
            </option>
          ))}
        </select>
      </div>

      {/* Document Categories */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-md font-medium text-gray-900 mb-3">Document Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map(category => {
            const IconComponent = getCategoryIcon(category.icon)
            return (
              <div
                key={category.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  filterType === category.code 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFilterType(category.code)}
              >
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-4 w-4 text-${category.color}-500`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {category.count} document{category.count !== 1 ? 's' : ''}
                    </p>
                </div>
                </div>
              </div>
            )
          })}
              </div>
            </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-md font-medium text-gray-900">Document History</h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-600">Loading documents...</span>
          </div>
        ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' 
                ? 'No documents match your search criteria' 
                : 'No documents uploaded yet'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDocuments.map((document) => {
              const IconComponent = getCategoryIcon(document.document_type?.icon || 'file')
              return (
                <div key={document.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg bg-${document.document_type?.color || 'gray'}-100`}>
                        <IconComponent className={`h-5 w-5 text-${document.document_type?.color || 'gray'}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 truncate">
                            {document.original_filename}
                          </p>
                          {document.status === 'active' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(document.created_at).toLocaleDateString()}
                          </span>
                          <span>{formatFileSize(document.file_size)}</span>
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {document.uploaded_by || 'System'}
                          </span>
                          {document.document_type && (
                            <span className={`px-2 py-1 rounded-full text-xs bg-${document.document_type.color}-100 text-${document.document_type.color}-800`}>
                              {document.document_type.name}
                            </span>
                          )}
                        </div>
                        {document.description && (
                          <p className="text-sm text-gray-600 mt-1 truncate">
                            {document.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {isViewable(document) && (
                        <button
                          onClick={() => handleView(document)}
                          className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDownload(document)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(document)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
            </div>
          )}
        </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select document type</option>
                  {documentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter document description..."
                />
      </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !selectedType || uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showViewerModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg ${isFullscreen ? 'w-full h-full' : 'w-11/12 h-5/6'} flex flex-col`}>
            {/* Viewer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedDocument.original_filename}
                </h3>
                <span className="text-sm text-gray-500">
                  {formatFileSize(selectedDocument.file_size)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* Zoom Controls */}
                <button
                  onClick={() => setViewerZoom(Math.max(0.5, viewerZoom - 0.25))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {Math.round(viewerZoom * 100)}%
                </span>
                <button
                  onClick={() => setViewerZoom(Math.min(3, viewerZoom + 0.25))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                
                {/* Rotation Control */}
                <button
                  onClick={() => setViewerRotation(viewerRotation + 90)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title="Rotate"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                
                {/* Fullscreen Toggle */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
                
                {/* Download Button */}
                <button
                  onClick={() => handleDownload(selectedDocument)}
                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                
                {/* Close Button */}
                <button
                  onClick={() => setShowViewerModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
            </div>
          </div>

            {/* Viewer Content */}
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <div className="flex justify-center items-center h-full">
                {selectedDocument.mime_type.startsWith('image/') ? (
                  <img
                    src={getDocumentUrl(selectedDocument)}
                    alt={selectedDocument.original_filename}
                    className="max-w-full max-h-full object-contain"
                    style={{
                      transform: `scale(${viewerZoom}) rotate(${viewerRotation}deg)`,
                      transition: 'transform 0.2s ease-in-out'
                    }}
                  />
                ) : selectedDocument.mime_type === 'application/pdf' ? (
                  <iframe
                    src={`${getDocumentUrl(selectedDocument)}#toolbar=1&navpanes=1&scrollbar=1&zoom=${viewerZoom * 100}`}
                    className="w-full h-full border-0"
                    title={selectedDocument.original_filename}
                  />
                ) : selectedDocument.mime_type.startsWith('text/') ? (
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-full overflow-auto">
                    {loadingContent ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        <span className="ml-2 text-sm text-gray-600">Loading content...</span>
            </div>
                    ) : (
                      <pre className="text-sm whitespace-pre-wrap font-mono text-gray-900">
                        {textContent || 'No content available'}
                      </pre>
                    )}
          </div>
                ) : (
                  <div className="text-center">
                    <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      This file type cannot be previewed in the browser
                    </p>
                    <Button
                      onClick={() => handleDownload(selectedDocument)}
                      className="flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download to View</span>
                    </Button>
            </div>
                )}
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  )
}

export default PatientDocuments
