import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Search, Bell, User, Menu, LayoutGrid, Layout, X, ChevronDown } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { toggleSidebar, setLayoutType } from '../../features/ui/uiSlice'
import { Link, useLocation } from 'react-router-dom'
import { menuItems } from './menuItems'

// Custom hook for responsive navigation
const useResponsiveNavigation = (items: any[], containerRef: React.RefObject<HTMLDivElement>) => {
  const [visibleItems, setVisibleItems] = useState<any[]>([])
  const [hiddenItems, setHiddenItems] = useState<any[]>([])
  const [isCalculating, setIsCalculating] = useState(true)

  const calculateVisibleItems = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    
    // Get the actual viewport width and calculate realistic available space
    const viewportWidth = window.innerWidth
    const headerPadding = 48 // px-6 (24px) on each side
    const logoSectionWidth = 250 // Logo + "MindBrite EMR" text + spacing
    const rightSectionWidth = 450 // Search + layout toggle + notifications + user menu + spacing
    const availableWidth = viewportWidth - headerPadding - logoSectionWidth - rightSectionWidth
    
    // Ensure we have a reasonable minimum width and don't exceed available space
    const maxNavWidth = Math.max(availableWidth, 200) // Minimum 200px for navigation
    
    console.log('Viewport width:', viewportWidth, 'Available width for nav:', availableWidth, 'Max nav width:', maxNavWidth)

    let currentWidth = 0
    const visible: any[] = []
    const hidden: any[] = []

    items.forEach((item) => {
      // Much more conservative width estimates
      let estimatedWidth = 0
      
      if (item.name === 'Dashboard') {
        estimatedWidth = 90 // Very tight estimate
      } else if (item.name === 'Patients') {
        estimatedWidth = 80 // Very tight estimate
      } else if (item.name === 'Appointments') {
        estimatedWidth = 110 // Tight estimate
      } else if (item.name === 'Clinic') {
        estimatedWidth = 70 // Very tight estimate
      } else if (item.name === 'CRM') {
        estimatedWidth = 60 // Very tight estimate
      } else if (item.name === 'Inventory') {
        estimatedWidth = 90 // Tight estimate
      } else if (item.name === 'Reports') {
        estimatedWidth = 80 // Tight estimate
      } else if (item.name === 'Settings') {
        estimatedWidth = 80 // Tight estimate
      } else {
        estimatedWidth = 85 // Default tight estimate
      }
      
      // Minimal buffer
      estimatedWidth += 8
      
      // Use the more restrictive maxNavWidth instead of availableWidth
      if (currentWidth + estimatedWidth <= maxNavWidth) {
        visible.push(item)
        currentWidth += estimatedWidth
      } else {
        hidden.push(item)
      }
    })

    console.log('Available width:', availableWidth, 'Current width used:', currentWidth, 'Visible items:', visible.length, 'Hidden items:', hidden.length, 'Items:', items.map(i => i.name))
    
    setVisibleItems(visible)
    setHiddenItems(hidden)
    setIsCalculating(false)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    
    calculateVisibleItems()
    
    const resizeObserver = new ResizeObserver(() => {
      setIsCalculating(true)
      setTimeout(calculateVisibleItems, 100) // Small delay to ensure DOM is updated
    })

    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [calculateVisibleItems])

  // Recalculate when items change
  useEffect(() => {
    if (items.length > 0) {
      calculateVisibleItems()
    }
  }, [items, calculateVisibleItems])

  return { visibleItems, hiddenItems, isCalculating }
}

const TopBarHeader: React.FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { sidebar, layout } = useSelector((state: RootState) => state.ui)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearchPopup, setShowSearchPopup] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigationContainerRef = useRef<HTMLDivElement>(null)
  const searchPopupRef = useRef<HTMLDivElement>(null)

  const handleLayoutToggle = () => {
    const newLayout = layout.type === 'sidebar' ? 'topbar' : 'sidebar'
    dispatch(setLayoutType(newLayout))
  }

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar())
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navigationItems = useMemo(() => menuItems, [])

  // Simple responsive navigation - show items that fit, hide rest in More menu
  const [visibleItems, setVisibleItems] = useState<any[]>([])
  const [hiddenItems, setHiddenItems] = useState<any[]>([])

  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!navigationContainerRef.current) return

      // Get the actual parent container to understand the full layout
      const container = navigationContainerRef.current
      const headerContainer = container.closest('header')
      const headerWidth = headerContainer?.offsetWidth || 0
      
      // Calculate available space for navigation
      // Reserve space for logo, search, and user menu
      const logoWidth = 250 // Logo + "MindBrite EMR" text
      const rightSectionWidth = 450 // Search + layout toggle + notifications + user menu
      const headerPadding = 48 // px-6 (24px on each side)
      const availableWidth = headerWidth - logoWidth - rightSectionWidth - headerPadding
      
      console.log('Header width:', headerWidth, 'Available width for nav:', availableWidth, 'Navigation items count:', navigationItems.length)
      
      // More accurate width calculation per item
      let currentWidth = 0
      const visible: any[] = []
      const hidden: any[] = []
      
      navigationItems.forEach((item) => {
        // Calculate actual width needed for each item
        let itemWidth = 0
        
        // Base width for text + icon + padding + spacing
        if (item.name === 'Dashboard') {
          itemWidth = 100
        } else if (item.name === 'Patients') {
          itemWidth = 90
        } else if (item.name === 'Appointments') {
          itemWidth = 120
        } else if (item.name === 'Clinic') {
          itemWidth = 80
        } else if (item.name === 'CRM') {
          itemWidth = 70
        } else {
          itemWidth = 90
        }
        
        // Add spacing between items
        itemWidth += 16 // space-x-4 = 16px
        
        // Check if this item fits
        if (currentWidth + itemWidth <= availableWidth) {
          visible.push(item)
          currentWidth += itemWidth
        } else {
          hidden.push(item)
        }
      })
      
      console.log('Available width:', availableWidth, 'Current width used:', currentWidth, 'Visible items:', visible.length, 'Hidden items:', hidden.length)
      
      setVisibleItems(visible)
      setHiddenItems(hidden)
    }

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(calculateVisibleItems, 100)
    
    // Add window resize listener for responsive behavior
    const handleResize = () => {
      console.log('Window resized, recalculating navigation items...')
      setTimeout(calculateVisibleItems, 100)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Also observe the header element for size changes
    const headerElement = navigationContainerRef.current?.closest('header')
    const resizeObserver = new ResizeObserver(() => {
      console.log('Header size changed, recalculating navigation items...')
      setTimeout(calculateVisibleItems, 50)
    })
    
    if (headerElement) {
      resizeObserver.observe(headerElement)
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()
    }
  }, [navigationItems])

  // Close search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchPopupRef.current && !searchPopupRef.current.contains(event.target as Node)) {
        setShowSearchPopup(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    console.log('Searching for:', searchQuery)
    setShowSearchPopup(false)
    setSearchQuery('')
  }

  const toggleSearchPopup = () => setShowSearchPopup(!showSearchPopup)

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Header */}
      <header className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MB</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">MindBrite EMR</span>
            </div>
            
            {/* Top Navigation Menu - Always visible in topbar layout */}
            {layout.type === 'topbar' && (
              <nav 
                ref={navigationContainerRef} 
                className="flex items-center space-x-4"
              >
                {/* Visible navigation items */}
                {visibleItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <div key={item.path} className="relative flex-shrink-0" style={{ position: 'relative' }}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive(item.path)
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        onMouseEnter={() => {
                          if (item.hasDropdown) {
                            console.log('Hovering over:', item.name, 'Setting hoveredItem to:', item.path)
                            setHoveredItem(item.path)
                          }
                        }}
                        onMouseLeave={() => {
                          console.log('Leaving:', item.name, 'Setting hoveredItem to null')
                          setHoveredItem(null)
                        }}
                      >
                        <IconComponent className="mr-2 h-4 w-4" />
                        {item.name}
                        {item.hasDropdown && (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Link>
                      
                      {/* Dropdown menu for items with hasDropdown */}
                      {item.hasDropdown && hoveredItem === item.path && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            width: '192px',
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            zIndex: 999999,
                            display: 'block',
                            minHeight: '50px'
                          }}
                          onMouseEnter={() => setHoveredItem(item.path)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >

                                                    <div className="py-1">
                            {item.subItems ? (
                              // If item has subItems, render them dynamically
                              item.subItems.map((subItem) => {
                                const SubIconComponent = subItem.icon
                                return (
                                  <Link
                                    key={subItem.path}
                                    to={subItem.path}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <SubIconComponent className="mr-2 h-4 w-4" />
                                    {subItem.name}
                                  </Link>
                                )
                              })
                            ) : (
                              // Default dropdown for items without subItems
                              <>
                                <Link
                                  to={`${item.path}/list`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  View All {item.name}
                                </Link>
                                <Link
                                  to={`${item.path}/new`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Add New {item.name.slice(0, -1)}
                                </Link>
                                <Link
                                  to={`${item.path}/reports`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  {item.name} Reports
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                
                {/* More menu - show when there are hidden items */}
                {hiddenItems.length > 0 && (
                  <div className="relative flex-shrink-0">
                    <button 
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                      onMouseEnter={() => {
                        console.log('Hovering over More menu, setting showMoreMenu to true')
                        setShowMoreMenu(true)
                      }}
                      onMouseLeave={() => {
                        console.log('Leaving More menu, setting showMoreMenu to false')
                        setShowMoreMenu(false)
                      }}
                    >
                      <span className="mr-2">⋯</span>
                      <span className="text-xs text-gray-500">({hiddenItems.length})</span>
                    </button>
                    
                    {showMoreMenu && (
                      <div 
                        className="absolute top-full left-0 mt-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                        onMouseEnter={() => setShowMoreMenu(true)}
                        onMouseLeave={() => setShowMoreMenu(false)}
                      >
                        <div className="py-1">
                          {hiddenItems.map((item) => {
                            const IconComponent = item.icon
                            return (
                              <div key={item.path} className="relative group">
                                <Link
                                  to={item.path}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                >
                                  <IconComponent className="mr-2 h-4 w-4" />
                                  {item.name}
                                  {item.hasDropdown && (
                                    <ChevronDown className="ml-auto h-4 w-4" />
                                  )}
                                </Link>
                                
                                {/* Sub-menu dropdown for items with hasDropdown */}
                                {item.hasDropdown && (
                                  <div 
                                    className="absolute left-full top-0 ml-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                                    style={{
                                      minHeight: '50px'
                                    }}
                                  >
                                    <div className="py-1">
                                      {item.subItems ? (
                                        // If item has subItems, render them dynamically
                                        item.subItems.map((subItem) => {
                                          const SubIconComponent = subItem.icon
                                          return (
                                            <Link
                                              key={subItem.path}
                                              to={subItem.path}
                                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                              <SubIconComponent className="mr-2 h-4 w-4" />
                                              {subItem.name}
                                            </Link>
                                          )
                                        })
                                      ) : (
                                        // Default dropdown for items without subItems
                                        <>
                                          <Link
                                            to={`${item.path}/list`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                          >
                                            View All {item.name}
                                          </Link>
                                          <Link
                                            to={`${item.path}/new`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                          >
                                            Add New {item.name.slice(0, -1)}
                                          </Link>
                                          <Link
                                            to={`${item.path}/reports`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                          >
                                            {item.name} Reports
                                          </Link>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </nav>
            )}
          </div>

          {/* Right side - Search, Layout Toggle, Notifications and User */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <div className="relative" ref={searchPopupRef}>
              <button
                onClick={toggleSearchPopup}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Search Popup */}
              {showSearchPopup && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900">Search</h3>
                      <button
                        onClick={toggleSearchPopup}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <form onSubmit={handleSearch}>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search patients, appointments, reports..."
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          autoFocus
                        />
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Search
                        </button>
                      </div>
                    </form>
                    {/* Search suggestions or recent searches can be added here */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Quick search: patients, appointments, reports</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Layout Toggle Buttons */}
            <div className="flex items-center space-x-1 border-l border-gray-300 pl-4">
              <button
                onClick={handleLayoutToggle}
                className={`p-2 rounded-md transition-colors ${
                  layout.type === 'sidebar' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Sidebar Layout"
              >
                <Layout className="h-4 w-4" />
              </button>
              <button
                onClick={handleLayoutToggle}
                className={`p-2 rounded-md transition-colors ${
                  layout.type === 'topbar' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Top Bar Layout"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            {/* Notifications */}
            <button 
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">AU Admin User</p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">Admin User</div>
                      <div className="text-gray-500">admin@mindbrite.com</div>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    
                    <div className="border-t border-gray-100">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <span className="mr-3">🚪</span>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default TopBarHeader

