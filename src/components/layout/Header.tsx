import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { toggleSidebar } from '../../features/ui/uiSlice'
import { useAuth } from '../../hooks/useAuth'
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Menu as MenuIcon,
  X,
  PanelLeft
} from 'lucide-react'
import LayoutSwitcher from './LayoutSwitcher'

const Header: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { sidebar, layout } = useSelector((state: RootState) => state.ui)
  const { logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearchPopup, setShowSearchPopup] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchPopupRef = useRef<HTMLDivElement>(null)

  // Debug logging
  console.log('Header sidebar state:', sidebar)
  console.log('Header sidebar isOpen:', sidebar?.isOpen)

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
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleToggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', sidebar?.isOpen)
    console.log('Dispatching toggleSidebar action')
    try {
      dispatch(toggleSidebar())
      console.log('toggleSidebar action dispatched successfully')
    } catch (error) {
      console.error('Error dispatching toggleSidebar:', error)
    }
  }

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu)
  const toggleNotifications = () => setShowNotifications(!showNotifications)
  const toggleSearchPopup = () => setShowSearchPopup(!showSearchPopup)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    console.log('Searching for:', searchQuery)
    setShowSearchPopup(false)
    setSearchQuery('')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo, sidebar toggle and search */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">MB</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">MindBrite EMR</h1>
                <p className="text-xs text-gray-500">Electronic Medical Records</p>
              </div>
            </div>
            
            {/* Sidebar toggle button - Different icon for sidebar */}
            <button
              onClick={handleToggleSidebar}
              className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                sidebar.isOpen 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
              }`}
              aria-label="Toggle sidebar"
              type="button"
              title={sidebar.isOpen ? "Hide Sidebar" : "Show Sidebar"}
            >
              {sidebar.isOpen ? <X className="h-6 w-6" /> : <PanelLeft className="h-6 w-6" />}
            </button>

            {/* Layout Switcher */}
            <LayoutSwitcher />
            
            {/* Search Icon */}
            <div className="relative" ref={searchPopupRef}>
              <button
                onClick={toggleSearchPopup}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Search"
              >
                <Search className="h-6 w-6" />
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
          </div>

          {/* Right side - Notifications and user menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="Notifications"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              
              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <h3 className="font-medium">Notifications</h3>
                    </div>
                    <div className="px-4 py-3 text-sm text-gray-500">
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
                className="flex items-center space-x-3 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-label="User menu"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                      <div className="text-gray-500">{user?.email}</div>
                    </div>
                    
                    <a
                      href="#profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="mr-3 h-4 w-4" />
                      Profile
                    </a>
                    
                    <a
                      href="#settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </a>
                    
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 