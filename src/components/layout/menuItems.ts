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
  Video,
  Clock
} from 'lucide-react'

export interface MenuItem {
  name: string
  path: string
  href?: string // For sidebar compatibility
  icon: React.ComponentType<{ className?: string }>
  hasDropdown?: boolean
  subItems?: SubMenuItem[]
  badge?: string
  children?: MenuItem[] // For sidebar compatibility
}

export interface SubMenuItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

// Unified menu items array for both layouts
export const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Patients',
    path: '/patients',
    icon: Users,
    hasDropdown: true,
    subItems: [
      { name: 'All Patients', path: '/patients', icon: Users },
      { name: 'Forms', path: '/patients/forms', icon: FileText }
    ],
    children: [
      { name: 'All Patients', path: '/patients', icon: Users },
      { name: 'Forms', path: '/patients/forms', icon: FileText }
    ]
  },
  {
    name: 'Appointments',
    path: '/appointments',
    icon: Calendar,
    hasDropdown: true,
    subItems: [
      { name: 'All Appointments', path: '/appointments', icon: Calendar },
      { name: 'Calendar', path: '/appointments/calendar', icon: Calendar },
      { name: 'Video Sessions', path: '/appointments/video-sessions', icon: Video },
      { name: 'Schedule', path: '/appointments/schedule', icon: Clock }
    ],
    children: [
      { name: 'All Appointments', path: '/appointments', icon: Calendar },
      { name: 'Calendar', path: '/appointments/calendar', icon: Calendar },
      { name: 'Video Sessions', path: '/appointments/video', icon: MessageSquare },
      { name: 'Schedule', path: '/appointments/schedule', icon: Calendar }
    ]
  },
  {
    name: 'CRM',
    path: '/crm',
    icon: Building2,
    hasDropdown: true,
    subItems: [
      { name: 'Dashboard', path: '/crm', icon: LayoutDashboard },
      { name: 'Leads', path: '/crm/leads', icon: Users },
      { name: 'Contacts', path: '/crm/contacts', icon: Users },
      { name: 'Opportunities', path: '/crm/opportunities', icon: Building2 },
      { name: 'Follow-ups', path: '/crm/followups', icon: Clock }
    ],
    children: [
      { name: 'Dashboard', path: '/crm', icon: LayoutDashboard },
      { name: 'Leads', path: '/crm/leads', icon: Users },
      { name: 'Contacts', path: '/crm/contacts', icon: Users },
      { name: 'Opportunities', path: '/crm/opportunities', icon: Building2 },
      { name: 'Follow-ups', path: '/crm/followups', icon: Calendar }
    ]
  },
  {
    name: 'Clinic',
    path: '/clinic',
    icon: Building2,
    hasDropdown: true,
    subItems: [
      { name: 'Facilities', path: '/facilities', icon: Building2 },
      { name: 'Locations', path: '/locations', icon: Building2 }
    ],
    children: [
      { name: 'Facilities', path: '/facilities', icon: Building2 },
      { name: 'Locations', path: '/locations', icon: Building2 }
    ]
  },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: Package,
    hasDropdown: true,
    subItems: [
      { name: 'Devices', path: '/inventory/devices', icon: Package },
      { name: 'Shipments', path: '/inventory/shipments', icon: Package },
      { name: 'Returns', path: '/inventory/returns', icon: Package }
    ],
    children: [
      { name: 'Devices', path: '/inventory/devices', icon: Package },
      { name: 'Shipments', path: '/inventory/shipments', icon: Package },
      { name: 'Returns', path: '/inventory/returns', icon: Package }
    ]
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: BarChart3,
    hasDropdown: true,
    subItems: [
      { name: 'Patient Reports', path: '/reports/patients', icon: FileText },
      { name: 'Analytics', path: '/reports/analytics', icon: BarChart3 },
      { name: 'Billing', path: '/reports/billing', icon: BarChart3 }
    ],
    children: [
      { name: 'Patient Reports', path: '/reports/patients', icon: FileText },
      { name: 'Analytics', path: '/reports/analytics', icon: BarChart3 },
      { name: 'Billing', path: '/reports/billing', icon: BarChart3 }
    ]
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    hasDropdown: true,
    subItems: [
      { name: 'Users & Roles', path: '/settings/users', icon: Users },
      { name: 'System Settings', path: '/settings/system', icon: Settings },
      { name: 'Master Data', path: '/settings/master-data', icon: Settings },
      { name: 'Help Desk', path: '/settings/help-desk', icon: HelpCircle }
    ],
    children: [
      { name: 'Users & Roles', path: '/settings/users', icon: Users },
      { name: 'System Settings', path: '/settings/system', icon: Settings },
      { name: 'Master Data', path: '/settings/master-data', icon: Settings },
      { name: 'Help Desk', path: '/settings/help-desk', icon: HelpCircle }
    ]
  }
]

// Helper function to get menu items for specific layout
export const getMenuItemsForLayout = (layoutType: 'sidebar' | 'topbar') => {
  if (layoutType === 'sidebar') {
    // For sidebar, return items with children property and href
    const addHrefToChildren = (item: MenuItem): MenuItem => ({
      ...item,
      href: item.path, // Sidebar uses 'href' instead of 'path'
      children: item.children?.map(child => addHrefToChildren(child)) || []
    })
    
    return menuItems.map(item => addHrefToChildren(item))
  } else {
    // For topbar, return items with subItems property
    return menuItems.map(item => ({
      ...item,
      subItems: item.subItems || []
    }))
  }
}
