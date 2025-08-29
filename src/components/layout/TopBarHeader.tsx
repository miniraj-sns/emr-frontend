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

  // Menu items configuration
  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Patients',
      href: '/patients',
      icon: Users
    },
    {
      name: 'Appointments',
      href: '/appointments',
      icon: Calendar
    },
    {
      name: 'CRM',
      href: '/crm',
      icon: Building2
    },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: Package
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      children: [
        { name: 'System Settings', href: '/settings/system' },
        { name: 'Master Data', href: '/settings/master-data' },
        { name: 'Users & Roles', href: '/settings/users' },
        { name: 'Help Desk', href: '/settings/help-desk' }
      ]
    }
  ]

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
        setExpandedOverflowMenus([])
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

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const toggleOverflowMenu = () => {
    setShowOverflowMenu(!showOverflowMenu)
    if (!showOverflowMenu) {
        updateOverflowMenuPosition()
      }
    }

  const updateOverflowMenuPosition = () => {
    if (overflowMenuRef.current) {
      const rect = overflowMenuRef.current.getBoundingClientRect()
      setOverflowMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      })
    }
  }

  const getOverflowMenus = () => {
    return menuItems.filter((_, index) => !visibleMenus.includes(index))
  }

  const renderMenuItem = (item: any, index: number) => {
    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
    const isExpanded = expandedMenus.includes(item.name)
    
    if (item.children) {
      return (
        <div key={item.name} className="relative" data-menu-button>
          <button
            onClick={() => toggleMenu(item.name)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5 mr-2" />
            {item.name}
            <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          {isExpanded && (
            <div 
              className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              data-submenu
            >
              <div className="py-1">
                {item.children.map((child: any) => (
                  <Link
                    key={child.name}
                    to={child.href}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setExpandedMenus([])}
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
          isActive
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <item.icon className="h-5 w-5 mr-2" />
        {item.name}
      </Link>
    )
  }

  const renderOverflowMenuItem = (item: any, index: number) => {
    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
    const isExpanded = expandedOverflowMenus.includes(item.name)
    
    if (item.children) {
      return (
        <div key={item.name} className="relative" data-overflow-menu-button>
          <button
            onClick={() => {
              setExpandedOverflowMenus(prev => 
                prev.includes(item.name) 
                  ? prev.filter(name => name !== item.name)
                  : [...prev, item.name]
              )
            }}
            className={`flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
              isActive ? 'bg-blue-50 text-blue-700' : ''
            }`}
          >
            <div className="flex items-center">
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </div>
            <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
          
          {isExpanded && (
            <div 
              className="absolute left-full top-0 ml-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
              data-overflow-submenu
            >
              <div className="py-1">
                {item.children.map((child: any) => (
                  <Link
                    key={child.name}
                    to={child.href}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setShowOverflowMenu(false)
                      setExpandedOverflowMenus([])
                    }}
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
        className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
          isActive ? 'bg-blue-50 text-blue-700' : ''
        }`}
        onClick={() => {
          setShowOverflowMenu(false)
          setExpandedOverflowMenus([])
        }}
      >
        <item.icon className="h-4 w-4 mr-2" />
        {item.name}
      </Link>
    )
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-lg font-semibold text-gray-900">EMR</h1>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav ref={navRef} className="hidden md:flex items-center space-x-1 flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                {menuItems.map((item, index) => {
                  if (visibleMenus.includes(index)) {
                    return renderMenuItem(item, index)
                  }
                  return null
                })}
              </div>
              
              {/* Overflow Menu */}
              {getOverflowMenus().length > 0 && (
                <div className="flex-shrink-0" ref={overflowMenuRef}>
                  <button
                    onClick={toggleOverflowMenu}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      showOverflowMenu
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="ml-1 text-xs text-gray-500">({getOverflowMenus().length})</span>
                  </button>
                </div>
              )}
              
              {/* Overflow Menu Dropdown */}
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
                      More Options
                    </div>
                    {getOverflowMenus().map((item, index) => renderOverflowMenuItem(item, index))}
                  </div>
                </div>
              )}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
            <div className="relative" ref={searchPopupRef}>
              <button
                  onClick={() => setShowSearchPopup(!showSearchPopup)}
                  className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {showSearchPopup && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                        <input
                          type="text"
                        placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              >
                <Bell className="h-5 w-5" />
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Notifications</h3>
                      <p className="text-sm text-gray-500">No new notifications</p>
                  </div>
                </div>
              )}
            </div>

              {/* Layout Switcher */}
              <LayoutSwitcher />

              {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || 'User'}
                  </span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <p className="font-medium">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">
                          {user?.roles?.join(', ') || 'User'}
                        </p>
                      </div>
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
