import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package, Wrench } from 'lucide-react';
import { servicesService, Service, Product } from '../../services/servicesService';

interface ServicesAndProductsManagerProps {
  onServiceSelect?: (service: Service) => void;
  onProductSelect?: (product: Product) => void;
  selectionMode?: boolean;
}

const ServicesAndProductsManager: React.FC<ServicesAndProductsManagerProps> = ({
  onServiceSelect,
  onProductSelect,
  selectionMode = false
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | Product | null>(null);

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesService.getServices({
        search: searchTerm || undefined,
        per_page: 50
      });
      setServices(response.services);
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await servicesService.getProducts({
        search: searchTerm || undefined,
        per_page: 50
      });
      setProducts(response.products);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    } else {
      fetchProducts();
    }
  }, [activeTab, searchTerm]);

  const handleDeleteService = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await servicesService.deleteService(id);
        fetchServices();
      } catch (err) {
        setError('Failed to delete service');
        console.error('Error deleting service:', err);
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await servicesService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleServiceSelect = (service: Service) => {
    if (selectionMode && onServiceSelect) {
      onServiceSelect(service);
    }
  };

  const handleProductSelect = (product: Product) => {
    if (selectionMode && onProductSelect) {
      onProductSelect(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Services & Products Management
          </h2>
          {!selectionMode && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {activeTab === 'services' ? 'Service' : 'Product'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'services'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Wrench className="w-4 h-4 mr-2" />
            Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'products'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="w-4 h-4 mr-2" />
            Products ({products.length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'services' ? (
              services.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No services found
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        selectionMode ? 'cursor-pointer hover:border-blue-300' : ''
                      }`}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <span className="text-sm text-gray-500">{service.code}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-green-600">
                          ${service.price}
                        </span>
                        <div className="flex space-x-2">
                          {!selectionMode && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingItem(service);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteService(service.id);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>{service.category}</span>
                        <span>{service.duration_minutes} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No products found
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        selectionMode ? 'cursor-pointer hover:border-blue-300' : ''
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <span className="text-sm text-gray-500">{product.code}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-green-600">
                          ${product.price}
                        </span>
                        <div className="flex space-x-2">
                          {!selectionMode && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingItem(product);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProduct(product.id);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>{product.category}</span>
                        <span>Stock: {product.stock_quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesAndProductsManager;
