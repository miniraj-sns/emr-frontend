import React, { useState, useEffect } from 'react'
import { X, Download, FileText, AlertCircle } from 'lucide-react'
import { billingService, Invoice } from '../../services/billingService'
import Button from '../ui/Button'

interface InvoiceViewerProps {
  invoice: Invoice
  patientId: number
  isOpen: boolean
  onClose: () => void
}

const InvoiceViewer: React.FC<InvoiceViewerProps> = ({ 
  invoice, 
  patientId, 
  isOpen, 
  onClose 
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && invoice) {
      loadInvoice()
    }
  }, [isOpen, invoice])

  const loadInvoice = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const blob = await billingService.downloadInvoice(patientId, invoice.id)
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      setError('Failed to load invoice')
      console.error('Error loading invoice:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const blob = await billingService.downloadInvoice(patientId, invoice.id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = invoice.original_filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to download invoice')
      console.error('Error downloading invoice:', err)
    }
  }

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              {invoice.original_filename}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Close</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-hidden">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading invoice...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadInvoice}>Try Again</Button>
              </div>
            </div>
          )}

          {pdfUrl && !loading && !error && (
            <div className="h-full">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0 rounded"
                title={invoice.original_filename}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-medium">File Size:</span> {billingService.formatFileSize(invoice.file_size)}
            </div>
            <div>
              <span className="font-medium">Uploaded:</span> {new Date(invoice.created_at).toLocaleDateString()}
            </div>
            {invoice.description && (
              <div>
                <span className="font-medium">Description:</span> {invoice.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceViewer

