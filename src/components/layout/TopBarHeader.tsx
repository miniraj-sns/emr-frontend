import React, { useState } from 'react'
import { Search, Bell, User, Menu, Grid, List, X, ChevronDown, Home, Users, Calendar, Building, Package, BarChart3, Settings, LayoutDashboard } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { toggleSidebar, setLayoutType } from '../../features/ui/uiSlice'
import { Link, useLocation } from 'react-router-dom'

const TopBarHeader: React.FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { sidebar, layout } = useSelector((state: RootState) => state.ui)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

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

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', path: '/patients', icon: Users, hasDropdown: true },
    { name: 'Appointments', path: '/appointments', icon: Calendar, hasDropdown: true },
    { name: 'Clinic', path: '/clinic', icon: Building, hasDropdown: true, isClinic: true },
    { name: 'CRM', path: '/crm', icon: Building, hasDropdown: true },
  ]

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
              <nav className="flex items-center space-x-6">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <div key={item.path} className="relative group">
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive(item.path)
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="mr-2 h-4 w-4" />
                        {item.name}
                        {item.hasDropdown && (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Link>
                      
                      {/* Dropdown menu for items with hasDropdown */}
                      {item.hasDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="py-1">
                            {item.isClinic ? (
                              <>
                                <Link
                                  to="/facilities"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Facilities
                                </Link>
                                <Link
                                  to="/locations"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Locations
                                </Link>
                              </>
                            ) : (
                              <>
                                <Link
                                  to={item.name === 'Patients' ? item.path : `${item.path}/list`}
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
                
                {/* More menu */}
                <div className="relative group">
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                    <span className="mr-2">⋯</span>
                    <span className="text-xs text-gray-500">(3)</span>
                  </button>
                  
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/inventory"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        Inventory
                      </Link>
                      <Link
                        to="/reports"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Reports
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>
            )}
          </div>

          {/* Right side - Search, Layout Toggle, Notifications and User */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
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
                <List className="h-4 w-4" />
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
                <Grid className="h-4 w-4" />
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

