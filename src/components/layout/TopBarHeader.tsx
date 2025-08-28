import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { useAuth } from '../../hooks/useAuth'
import { Link, useLocation } from 'react-router-dom'
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  Package,
  BarChart3,
  FileText,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  ChevronDown as ChevronDownIcon,
  X,
  MoreHorizontal
} from 'lucide-react'
import LayoutSwitcher from './LayoutSwitcher'

const TopBarHeader: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { logout } = useAuth()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearchPopup, setShowSearchPopup] = useState(false)
  const [showOverflowMenu, setShowOverflowMenu] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleMenus, setVisibleMenus] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
  const [overflowMenuPosition, setOverflowMenuPosition] = useState({ top: 0, left: 0 })
  const [expandedOverflowMenus, setExpandedOverflowMenus] = useState<string[]>([])
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchPopupRef = useRef<HTMLDivElement>(null)
  const overflowMenuRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (searchPopupRef.current && !searchPopupRef.current.contains(event.target as Node)) {
        setShowSearchPopup(false)
      }
      
      // Handle overflow menu and its submenus
      const target = event.target as Element
      const isClickOnOverflowButton = overflowMenuRef.current && overflowMenuRef.current.contains(event.target as Node)
      const isClickOnOverflowSubmenu = target.closest && target.closest('[data-overflow-submenu]')
      const isClickOnOverflowMenuButton = target.closest && target.closest('[data-overflow-menu-button]')
      
      if (!isClickOnOverflowButton && !isClickOnOverflowSubmenu && !isClickOnOverflowMenuButton) {
        setShowOverflowMenu(false)
        setExpandedOverflowMenus([]) // Close all submenus when closing overflow menu
      }
      
      // Close main navigation submenus when clicking outside
      const isClickOnMenuButton = target.closest && target.closest('[data-menu-button]')
      const isClickOnSubmenu = target.closest && target.closest('[data-submenu]')
      
      if (!isClickOnMenuButton && !isClickOnSubmenu) {
        setExpandedMenus([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Update overflow menu position on window resize and scroll
  useEffect(() => {
    const handleResize = () => {
      if (showOverflowMenu) {
        updateOverflowMenuPosition()
      }
    }

    const handleScroll = () => {
      if (showOverflowMenu) {
        updateOverflowMenuPosition()
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [showOverflowMenu])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu)
  const toggleNotifications = () => setShowNotifications(!showNotifications)
  const toggleSearchPopup = () => setShowSearchPopup(!showSearchPopup)
  const updateOverflowMenuPosition = () => {
    if (overflowMenuRef.current) {
      const rect = overflowMenuRef.current.getBoundingClientRect()
      const dropdownWidth = 224 // w-56 = 14rem = 224px
      const dropdownHeight = 300 // Increased height to accommodate submenus
      
      // Calculate initial position
      let left = rect.left
      let top = rect.bottom + 4
      
      // Check if dropdown would go off the right edge
      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 8
      }
      
      // Check if dropdown would go off the bottom edge
      if (top + dropdownHeight > window.innerHeight) {
        top = rect.top - dropdownHeight - 4
      }
      
      // Ensure minimum left position
      left = Math.max(8, left)
      
      setOverflowMenuPosition({ top, left })
    }
  }

  const toggleOverflowMenu = () => {
    const newState = !showOverflowMenu
    setShowOverflowMenu(newState)
    
    if (newState) {
      // Update position when opening
      setTimeout(() => {
        updateOverflowMenuPosition()
      }, 0)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    console.log('Searching for:', searchQuery)
    setShowSearchPopup(false)
    setSearchQuery('')
  }

  const toggleMenu = (menuName: string) => {
    console.log('Toggling menu:', menuName)
    setExpandedMenus(prev => {
      const newState = prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
      console.log('New expanded menus:', newState)
      return newState
    })
  }

  const toggleOverflowSubmenu = (menuName: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }
    console.log('Toggling overflow submenu:', menuName)
    setExpandedOverflowMenus((prev: string[]) => {
      const newState = prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
      console.log('New expanded overflow menus:', newState)
      return newState
    })
  }

  const closeOverflowMenu = () => {
    setShowOverflowMenu(false)
    setExpandedOverflowMenus([])
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    
    if (href.includes('/crm')) {
      return location.pathname.startsWith(href)
    }
    
    return location.pathname === href
  }
  
  const isMenuExpanded = (menuName: string) => {
    // Only return true if the menu is manually expanded by user
    return expandedMenus.includes(menuName)
  }

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Patients',
      href: '/patients',
      icon: Users,
      children: [
        { name: 'All Patients', href: '/patients' },
        { name: 'Forms', href: '/patients/forms' }
      ]
    },
    {
      name: 'Appointments',
      href: '/appointments',
      icon: Calendar,
      children: [
        { name: 'All Appointments', href: '/appointments' },
        { name: 'Calendar', href: '/appointments/calendar' },
        { name: 'Video Sessions', href: '/appointments/video' },
        { name: 'Schedule', href: '/appointments/schedule' }
      ]
    },
    {
      name: 'CRM',
      href: '/crm',
      icon: Building2,
      children: [
        { name: 'Leads', href: '/crm/leads' },
        { name: 'Opportunities', href: '/crm/opportunities' },
        { name: 'Accounts', href: '/crm/accounts' },
        { name: 'Contacts', href: '/crm/contacts' }
      ]
    },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: Package,
      children: [
        { name: 'All Inventory', href: '/inventory' },
        { name: 'Stock Management', href: '/inventory/stock' },
        { name: 'Suppliers', href: '/inventory/suppliers' }
      ]
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings
    }
  ]

  // Calculate visible menus based on available space
  useEffect(() => {
    const calculateVisibleMenus = () => {
      console.log('calculateVisibleMenus called')
      
      // Get the header container width instead of just nav width
      const headerContainer = document.querySelector('header .px-4') as HTMLElement
      if (!headerContainer) {
        console.log('Header container not found')
        return
      }
      
      const headerWidth = headerContainer.offsetWidth
      console.log('Header width:', headerWidth)
      
      // Calculate space allocation for different screen sizes
      let availableNavWidth = 0
      
      if (headerWidth > 1200) {
        // Large screens: allocate more space for navigation
        availableNavWidth = headerWidth * 0.6 // 60% of header width
      } else if (headerWidth > 900) {
        // Medium screens: balanced allocation
        availableNavWidth = headerWidth * 0.5 // 50% of header width
      } else if (headerWidth > 600) {
        // Small-medium screens: less space for navigation
        availableNavWidth = headerWidth * 0.4 // 40% of header width
      } else {
        // Very small screens: minimal navigation space
        availableNavWidth = headerWidth * 0.3 // 30% of header width
      }
      
      // Reserve space for logo and right-side elements
      const logoSpace = 120 // Logo + spacing
      const rightSideSpace = 200 // Search, notifications, user menu
      const reservedSpace = logoSpace + rightSideSpace
      
      // Calculate actual available width for navigation
      const actualNavWidth = Math.max(0, availableNavWidth - reservedSpace)
      console.log('Available navigation width:', actualNavWidth)
      
      // Reserve space for overflow menu button
      const menuAvailableWidth = actualNavWidth - 60
      
      if (menuAvailableWidth <= 0) {
        console.log('No space for navigation, showing only ellipsis')
        setVisibleMenus([])
        return
      }
      
      const visibleIndices: number[] = []
      let currentWidth = 0

      console.log('Available width for menu items:', menuAvailableWidth)

      menuItems.forEach((item, index) => {
        // More accurate width estimation based on actual menu item structure
        // Icon (20px) + text width + padding (24px) + margin (8px)
        const baseWidth = 52 // icon + padding + margin
        const textWidth = Math.max(item.name.length * 6, 50) // More accurate text width
        const totalWidth = baseWidth + textWidth
        
        console.log(`Menu "${item.name}": estimated width ${totalWidth}px`)
        
        // Check if this menu item can fit
        if (currentWidth + totalWidth <= menuAvailableWidth) {
          visibleIndices.push(index)
          currentWidth += totalWidth
          console.log(`Added menu "${item.name}" at index ${index}, current width: ${currentWidth}`)
        } else {
          console.log(`Menu "${item.name}" at index ${index} cannot fit, stopping here`)
          return // Stop adding more menus
        }
      })

      console.log('Final visible menus:', visibleIndices)
      setVisibleMenus(visibleIndices)
    }

    // Calculate after a delay to ensure the element is properly rendered
    const timer = setTimeout(() => {
      calculateVisibleMenus()
    }, 500)
    
    window.addEventListener('resize', calculateVisibleMenus)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateVisibleMenus)
    }
  }, [])

  const renderMenuItem = (item: any, index: number) => {
    const Icon = item.icon
    const isExpanded = isMenuExpanded(item.name)
    const isVisible = visibleMenus.includes(index)
    console.log('Rendering menu item:', item.name, 'isExpanded:', isExpanded, 'isVisible:', isVisible, 'hasChildren:', !!item.children)
    if (!isVisible) return null
    
    if (item.children) {
      return (
        <div key={item.name} className="relative">
          <button
            data-menu-button
            onClick={() => toggleMenu(item.name)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive(item.href)
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-5 w-5 mr-2" />
            {item.name}
            <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {isExpanded && (
            <div data-submenu className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-[9999]">
              <div className="py-1">
                {item.children.map((child: any) => (
                  <Link
                    key={child.name}
                    to={child.href}
                    className={`block px-4 py-2 text-sm ${
                      isActive(child.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive(item.href)
            ? 'bg-primary-100 text-primary-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Icon className="h-5 w-5 mr-2" />
        {item.name}
      </Link>
    )
  }

  const getOverflowMenus = () => {
    const overflowMenus = menuItems.filter((_, index) => !visibleMenus.includes(index))
    console.log('Visible menus:', visibleMenus)
    console.log('Overflow menus:', overflowMenus.map(item => item.name))
    return overflowMenus
  }

  return (
    <>
      {/* Backdrop for submenus */}
      {(expandedMenus.length > 0 || expandedOverflowMenus.length > 0) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-10 z-[9998] transition-opacity duration-200"
          onClick={() => {
            setExpandedMenus([])
            setExpandedOverflowMenus([])
            setShowOverflowMenu(false)
          }}
        />
      )}
      
      <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and navigation */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">MB</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">EMR</h1>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav ref={navRef} className="hidden md:flex items-center space-x-1 flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                {menuItems.map((item, index) => {
                  // Only render menu items that are in the visibleMenus array
                  if (visibleMenus.includes(index)) {
                    return renderMenuItem(item, index)
                  }
                  return null
                })}
              </div>
              
              {/* Overflow Menu */}
              {getOverflowMenus().length > 0 && (
                <div className="flex-shrink-0" ref={overflowMenuRef} style={{ display: 'block' }}>
                  <button
                    onClick={toggleOverflowMenu}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      showOverflowMenu
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    style={{ display: 'flex' }}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="ml-1 text-xs text-gray-500">({getOverflowMenus().length})</span>
                  </button>
                </div>
              )}
              
              {/* Overflow Menu Dropdown - Positioned absolutely relative to viewport */}
              {showOverflowMenu && (
                <div 
                  className="fixed w-56 bg-white rounded-md shadow-lg border border-gray-200 z-[9999]"
                  style={{
                    top: overflowMenuPosition.top,
                    left: overflowMenuPosition.left,
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}
                >
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      Hidden menus ({getOverflowMenus().length})
                    </div>

                    {getOverflowMenus().map((item) => {
                      const Icon = item.icon
                      const isOverflowExpanded = expandedOverflowMenus.includes(item.name)
                      console.log('Rendering overflow item:', item.name, 'has children:', !!item.children, 'is expanded:', isOverflowExpanded)
                      
                      if (item.children) {
                        return (
                          <div key={item.name} className="relative">
                            <button
                              data-overflow-menu-button
                              onClick={(e) => toggleOverflowSubmenu(item.name, e)}
                              className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left ${
                                isActive(item.href)
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center">
                                <Icon className="h-5 w-5 mr-2" />
                                {item.name}
                              </div>
                              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOverflowExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isOverflowExpanded && (
                              <div data-overflow-submenu className="bg-gray-50 border-l-2 border-gray-200">
                                {item.children.map((child: any) => (
                                  <Link
                                    key={child.name}
                                    to={child.href}
                                    onClick={closeOverflowMenu}
                                    className={`flex items-center px-6 py-2 text-sm ${
                                      isActive(child.href)
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                  >
                                    <span className="ml-2">{child.name}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      }

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={closeOverflowMenu}
                          className={`flex items-center px-4 py-2 text-sm ${
                            isActive(item.href)
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-2" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* Right side - Search, layout switcher, notifications, user menu */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Search Icon */}
            <div className="relative" ref={searchPopupRef}>
              <button
                onClick={toggleSearchPopup}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Search Popup */}
              {showSearchPopup && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
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
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          autoFocus
                        />
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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

            {/* Layout Switcher */}
            <LayoutSwitcher />

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <Bell className="h-5 w-5" />
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No new notifications
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-white">
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </span>
                </div>
                <div className="hidden lg:block text-left whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.roles?.join(', ') || 'User'}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  )
}

export default TopBarHeader
