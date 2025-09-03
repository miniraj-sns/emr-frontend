import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { toggleSidebar } from '../../features/ui/uiSlice'
import { 
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react'
import { getMenuItemsForLayout } from './menuItems'

interface SidebarProps {
  isOpen: boolean
}

import { MenuItem } from './menuItems'

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  // Debug logging
  console.log('Sidebar isOpen:', isOpen)

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const handleMobileClose = () => {
    console.log('Mobile close clicked')
    dispatch(toggleSidebar())
  }

  const isActive = (href: string) => {
    // Safety check for undefined href
    if (!href) {
      console.warn('Sidebar: href is undefined for menu item')
      return false
    }
    
    // Special case for dashboard - highlight when on /dashboard
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    
    // For CRM routes, check if current path starts with the href
    if (href.includes('/crm')) {
      const active = location.pathname.startsWith(href)
      console.log(`Sidebar - Checking if ${href} is active: ${active}, current path: ${location.pathname}`)
      return active
    }
    
    // For other routes, check exact match
    const active = location.pathname === href
    return active
  }
  
  const isMenuExpanded = (menuName: string) => {
    // Auto-expand CRM menu if we're on any CRM page
    if (menuName === 'CRM' && location.pathname.startsWith('/crm')) {
      return true
    }
    return expandedMenus.includes(menuName)
  }

  const menuItems = getMenuItemsForLayout('sidebar')
  
  // Debug logging to see what we're getting
  console.log('Sidebar menuItems:', menuItems)
  console.log('First item href:', menuItems[0]?.href)

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = isMenuExpanded(item.name)
    const active = isActive(item.href || '')
    
    return (
      <div key={item.name}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleMenu(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                active || isExpanded
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {item.badge}
                  </span>
                )}
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {isExpanded && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children?.map(child => renderMenuItem(child, level + 1))}
              </div>
            )}
          </div>
        ) : (
          <Link
            to={item.href || '#'}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
              active
                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={() => {
              // Close sidebar on mobile when clicking a link
              if (window.innerWidth < 1024) {
                dispatch(toggleSidebar())
              }
            }}
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span>{item.name}</span>
            {item.badge && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {item.badge}
              </span>
            )}
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={handleMobileClose}
        />
      )}
      
      {/* Sidebar - Full height with flex layout */}
      <div className={`lg:h-full lg:w-64 lg:bg-white lg:shadow-lg lg:flex lg:flex-col lg:relative lg:z-auto fixed left-0 top-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`} style={{ height: 'calc(100vh - 65px)' }}>
        
        

        {/* Mobile close button only */}
        <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0 lg:hidden">
          <button 
            onClick={handleMobileClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation - Scrollable and flexible */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
          <div className="text-xs text-gray-500">
            <p>MindBrite EMR v1.0</p>
            <p>© 2025 MindBrite Health</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar 