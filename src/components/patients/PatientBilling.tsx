import React, { useState, useEffect, useRef } from 'react'
import { 
  DollarSign, 
  Upload, 
  Download, 
  FileText, 
  Plus,
  Edit,
  Save,
  X,
  Calendar,
  CreditCard,
  Receipt,
  AlertCircle,
  Package,
  Wrench
} from 'lucide-react'
import { billingService, PatientBilling as BillingType, Invoice, InvoiceLineItem } from '../../services/billingService'
import { servicesService, Service, Product } from '../../services/servicesService'
import Button from '../ui/Button'
import { Patient } from '../../types/patient'
import InvoiceViewer from './InvoiceViewer'
import ServicesAndProductsManager from '../services/ServicesAndProductsManager'

interface PatientBillingProps {
  patient: Patient
  onBillingUpdated?: () => void
}

const PatientBilling: React.FC<PatientBillingProps> = ({ patient, onBillingUpdated }) => {
  const [billing, setBilling] = useState<BillingType | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [creatingInvoice, setCreatingInvoice] = useState(false)
  const [downloadingInvoice, setDownloadingInvoice] = useState<number | null>(null)
  const [editingBilling, setEditingBilling] = useState<Partial<BillingType>>({})
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false)
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false)
  const [invoiceNotes, setInvoiceNotes] = useState('')
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([])
  const [showServicesProductsModal, setShowServicesProductsModal] = useState(false)
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchBillingData()
    fetchServicesAndProducts()
  }, [patient.id])

  const fetchServicesAndProducts = async () => {
    try {
      const [servicesResponse, productsResponse] = await Promise.all([
        servicesService.getServices({ per_page: 100 }),
        servicesService.getProducts({ per_page: 100 })
      ])
      setAvailableServices(servicesResponse.services)
      setAvailableProducts(productsResponse.products)
    } catch (err) {
      console.error('Error fetching services and products:', err)
    }
  }

  const fetchBillingData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await billingService.getPatientBilling(patient.id)
      setBilling(data.billing)
      setInvoices(data.invoices)
    } catch (err) {
      setError('Failed to fetch billing information')
      console.error('Error fetching billing data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditingBilling(billing || {})
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      if (!billing) return
      
      const updatedBilling = await billingService.updatePatientBilling(patient.id, editingBilling)
      setBilling(updatedBilling)
      setIsEditing(false)
      setEditingBilling({})
      onBillingUpdated?.()
    } catch (err) {
      setError('Failed to update billing information')
      console.error('Error updating billing:', err)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingBilling({})
  }

  const handleCreateInvoice = async () => {
    if (creatingInvoice) return // Prevent double submission
    
    try {
      setCreatingInvoice(true)
      setError(null)
      
      const newInvoice = await billingService.createInvoice(patient.id, {
        notes: invoiceNotes,
        line_items: lineItems.length > 0 ? lineItems : undefined
      })
      setInvoices(prev => [newInvoice, ...prev])
      setShowCreateInvoiceModal(false)
      setInvoiceNotes('')
      setLineItems([])
      
      // Refresh billing data to show updated amounts
      await fetchBillingData()
      onBillingUpdated?.()
    } catch (err) {
      setError('Failed to create invoice')
      console.error('Error creating invoice:', err)
    } finally {
      setCreatingInvoice(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setError(null)
      
      const description = `Invoice ${file.name.replace(/\.[^/.]+$/, '')}`
      const newInvoice = await billingService.uploadInvoice(patient.id, file, description)
      setInvoices(prev => [newInvoice, ...prev])
      onBillingUpdated?.()
    } catch (err) {
      setError('Failed to upload invoice')
      console.error('Error uploading invoice:', err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice)
    setShowInvoiceViewer(true)
  }

  const handleDownloadInvoice = async (invoice: Invoice) => {
    if (downloadingInvoice === invoice.id) return // Prevent multiple downloads
    
    try {
      setDownloadingInvoice(invoice.id)
      const blob = await billingService.downloadInvoice(patient.id, invoice.id)
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
    } finally {
      setDownloadingInvoice(null)
    }
  }

  const handleCloseInvoiceViewer = () => {
    setShowInvoiceViewer(false)
    setViewingInvoice(null)
  }

  const addLineItem = () => {
    setLineItems(prev => [...prev, {
      description: '',
      quantity: 1,
      unit_price: 0,
      total_amount: 0,
      service_type: 'consultation',
      notes: ''
    }])
  }

  const updateLineItem = (index: number, field: keyof InvoiceLineItem, value: string | number) => {
    setLineItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      
      // Recalculate total_amount
      if (field === 'quantity' || field === 'unit_price') {
        const quantity = parseFloat(updated[index].quantity?.toString() || '0') || 0
        const unitPrice = parseFloat(updated[index].unit_price?.toString() || '0') || 0
        updated[index].total_amount = quantity * unitPrice
      }
      
      return updated
    })
  }

  const removeLineItem = (index: number) => {
    setLineItems(prev => prev.filter((_, i) => i !== index))
  }

  const getTotalAmount = () => {
    return lineItems.reduce((sum, item) => {
      const amount = parseFloat(item.total_amount?.toString() || '0') || 0
      return sum + amount
    }, 0)
  }

  const handleServiceSelect = (service: Service) => {
    const newLineItem: InvoiceLineItem = {
      description: service.name,
      quantity: 1,
      unit_price: service.price,
      total_amount: service.price,
      service_type: 'service',
      notes: service.description
    }
    setLineItems([...lineItems, newLineItem])
    setShowServicesProductsModal(false)
  }

  const handleProductSelect = (product: Product) => {
    const newLineItem: InvoiceLineItem = {
      description: product.name,
      quantity: 1,
      unit_price: product.price,
      total_amount: product.price,
      service_type: 'product',
      notes: product.description
    }
    setLineItems([...lineItems, newLineItem])
    setShowServicesProductsModal(false)
  }

  const handleInputChange = (field: keyof BillingType, value: string | number) => {
    setEditingBilling(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-teal-600" />
          <h2 className="text-xl font-semibold text-gray-900">Billing Information</h2>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex items-center space-x-1"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="flex items-center space-x-1"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Billing Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Current Balance</span>
          </div>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={editingBilling.current_balance || ''}
              onChange={(e) => handleInputChange('current_balance', parseFloat(e.target.value) || 0)}
              className="w-full text-lg font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {billingService.formatCurrency(billing?.current_balance || 0)}
            </p>
          )}
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Receipt className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Total Charges</span>
          </div>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={editingBilling.total_charges || ''}
              onChange={(e) => handleInputChange('total_charges', parseFloat(e.target.value) || 0)}
              className="w-full text-lg font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {billingService.formatCurrency(billing?.total_charges || 0)}
            </p>
          )}
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600">Insurance Paid</span>
          </div>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={editingBilling.insurance_paid || ''}
              onChange={(e) => handleInputChange('insurance_paid', parseFloat(e.target.value) || 0)}
              className="w-full text-lg font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {billingService.formatCurrency(billing?.insurance_paid || 0)}
            </p>
          )}
        </div>

        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Patient Paid</span>
          </div>
          {isEditing ? (
            <input
              type="number"
              step="0.01"
              value={editingBilling.patient_paid || ''}
              onChange={(e) => handleInputChange('patient_paid', parseFloat(e.target.value) || 0)}
              className="w-full text-lg font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {billingService.formatCurrency(billing?.patient_paid || 0)}
            </p>
          )}
        </div>
      </div>

      {/* Payment Notes */}
      {billing?.payment_notes && (
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Payment Notes</h3>
          {isEditing ? (
            <textarea
              value={editingBilling.payment_notes || ''}
              onChange={(e) => handleInputChange('payment_notes', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              rows={3}
              placeholder="Add payment notes..."
            />
          ) : (
            <p className="text-sm text-gray-700">{billing.payment_notes}</p>
          )}
        </div>
      )}

      {/* Last Payment Info */}
      {billing?.last_payment_date && (
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-600">Last Payment</h3>
          </div>
          <p className="text-sm text-gray-700">
            {billingService.formatCurrency(billing.last_payment_amount || 0)} on{' '}
            {new Date(billing.last_payment_date).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Invoices Section */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => setShowCreateInvoiceModal(true)}
                disabled={creatingInvoice}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>{creatingInvoice ? 'Creating...' : 'Create Invoice'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center space-x-1"
              >
                <Upload className="h-4 w-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Invoice'}</span>
              </Button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="p-4">
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No invoices uploaded yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Upload invoices to track patient billing documents
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{invoice.original_filename}</p>
                      <p className="text-sm text-gray-500">
                        {billingService.formatFileSize(invoice.file_size)} •{' '}
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </p>
                      {invoice.description && (
                        <p className="text-sm text-gray-600">{invoice.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewInvoice(invoice)}
                      className="flex items-center space-x-1"
                    >
                      <FileText className="h-4 w-4" />
                      <span>View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice)}
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Viewer Modal */}
      {viewingInvoice && (
        <InvoiceViewer
          invoice={viewingInvoice}
          patientId={patient.id}
          isOpen={showInvoiceViewer}
          onClose={handleCloseInvoiceViewer}
        />
      )}

      {/* Create Invoice Modal */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create Invoice</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCreateInvoiceModal(false)
                    setLineItems([])
                    setInvoiceNotes('')
                  }}
                  className="flex items-center space-x-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Line Items Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Invoice Line Items</h4>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowServicesProductsModal(true)}
                        className="flex items-center space-x-1"
                      >
                        <Package className="h-4 w-4" />
                        <span>Select Services/Products</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={addLineItem}
                        className="flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Item</span>
                      </Button>
                    </div>
                  </div>
                  
                  {lineItems.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">No line items added yet</p>
                      <p className="text-sm text-gray-400">
                        Add consultation fees, therapy fees, lab test fees, etc.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lineItems.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            <div className="lg:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="e.g., Consultation Fee"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Type
                              </label>
                              <select
                                value={item.service_type}
                                onChange={(e) => updateLineItem(index, 'service_type', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                              >
                                <option value="consultation">Consultation</option>
                                <option value="therapy">Therapy</option>
                                <option value="lab_test">Lab Test</option>
                                <option value="procedure">Procedure</option>
                                <option value="medication">Medication</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                              </label>
                              <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={item.quantity}
                                onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unit Price
                              </label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unit_price}
                                onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                              />
                            </div>
                            
                            <div className="flex items-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeLineItem(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Notes (Optional)
                            </label>
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => updateLineItem(index, 'notes', e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                              placeholder="Additional notes for this item"
                            />
                          </div>
                          
                          <div className="mt-2 text-right">
                            <span className="text-sm font-medium text-gray-900">
                              Total: {billingService.formatCurrency(item.total_amount)}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {/* Total */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Invoice Total:</span>
                          <span className="text-xl font-bold text-gray-900">
                            {billingService.formatCurrency(getTotalAmount())}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Notes Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Notes (Optional)
                  </label>
                  <textarea
                    value={invoiceNotes}
                    onChange={(e) => setInvoiceNotes(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Add any notes for this invoice..."
                  />
                </div>
                
                {lineItems.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> If no line items are added, the invoice will be generated based on the patient's recent appointments with fees.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateInvoiceModal(false)
                    setLineItems([])
                    setInvoiceNotes('')
                  }}
                  disabled={creatingInvoice}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateInvoice}
                  disabled={creatingInvoice}
                  className="flex items-center space-x-1"
                >
                  {creatingInvoice ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Create Invoice</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services and Products Selection Modal */}
      {showServicesProductsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Select Services & Products</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowServicesProductsModal(false)}
                  className="flex items-center space-x-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <ServicesAndProductsManager
                onServiceSelect={handleServiceSelect}
                onProductSelect={handleProductSelect}
                selectionMode={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientBilling
