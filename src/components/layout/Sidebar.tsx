import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { toggleSidebar } from '../../features/ui/uiSlice'
import { 
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  Package,
  BarChart3,
  Settings,
  FileText,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
}

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: MenuItem[]
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { user } = useSelector((state: RootState) => state.auth)
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
    const active = location.pathname === href
    // Debug logging for CRM routes
    if (href.includes('/crm')) {
      console.log(`Sidebar - Checking if ${href} is active: ${active}, current path: ${location.pathname}`)
    }
    return active
  }
  
  const isMenuExpanded = (menuName: string) => {
    // Auto-expand CRM menu if we're on any CRM page
    if (menuName === 'CRM' && location.pathname.startsWith('/crm')) {
      return true
    }
    return expandedMenus.includes(menuName)
  }

  const menuItems: MenuItem[] = [
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
        { name: 'All Patients', href: '/patients', icon: Users },
        { name: 'Patient Timeline', href: '/patients/timeline', icon: FileText },
        { name: 'Forms', href: '/patients/forms', icon: FileText }
      ]
    },
    {
      name: 'Appointments',
      href: '/appointments',
      icon: Calendar,
      children: [
        { name: 'Calendar', href: '/appointments', icon: Calendar },
        { name: 'Video Sessions', href: '/appointments/video', icon: MessageSquare },
        { name: 'Schedule', href: '/appointments/schedule', icon: Calendar }
      ]
    },
    {
      name: 'CRM',
      href: '/crm',
      icon: Building2,
      children: [
        { name: 'Dashboard', href: '/crm', icon: LayoutDashboard },
        { name: 'Leads', href: '/crm/leads', icon: Users },
        { name: 'Contacts', href: '/crm/contacts', icon: Users },
        { name: 'Opportunities', href: '/crm/opportunities', icon: Building2 },
        { name: 'Follow-ups', href: '/crm/followups', icon: Calendar }
      ]
    },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: Package,
      children: [
        { name: 'Devices', href: '/inventory/devices', icon: Package },
        { name: 'Shipments', href: '/inventory/shipments', icon: Package },
        { name: 'Returns', href: '/inventory/returns', icon: Package }
      ]
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: BarChart3,
      children: [
        { name: 'Patient Reports', href: '/reports/patients', icon: FileText },
        { name: 'Analytics', href: '/reports/analytics', icon: BarChart3 },
        { name: 'Billing', href: '/reports/billing', icon: BarChart3 }
      ]
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      children: [
        { name: 'Users & Roles', href: '/settings/users', icon: Users },
        { name: 'System Settings', href: '/settings/system', icon: Settings },
        { name: 'Help Desk', href: '/settings/help-desk', icon: HelpCircle }
      ]
    }
  ]

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = isMenuExpanded(item.name)
    const active = isActive(item.href)
    
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
            to={item.href}
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
        
        

        {/* User info */}
        <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
          {/* Mobile close button */}
          <button 
            onClick={handleMobileClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500">
                {user?.roles?.join(', ') || 'User'}
              </p>
            </div>
          </div>
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