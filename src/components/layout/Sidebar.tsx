import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
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
  const location = useLocation()
  const { user } = useSelector((state: RootState) => state.auth)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const isActive = (href: string) => location.pathname === href
  const isMenuExpanded = (menuName: string) => expandedMenus.includes(menuName)

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
        { name: 'Leads', href: '/crm/leads', icon: Users },
        { name: 'Opportunities', href: '/crm/opportunities', icon: Building2 },
        { name: 'Pipelines', href: '/crm/pipelines', icon: BarChart3 }
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
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">MB</span>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">MindBrite EMR</h1>
              <p className="text-xs text-gray-500">Electronic Medical Records</p>
            </div>
          </div>
          
          {/* Mobile close button */}
          <button className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-gray-200">
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

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200">
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