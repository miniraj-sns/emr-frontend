import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import Sidebar from './Sidebar'
import Header from './Header'
import TopBarLayout from './TopBarLayout'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebar, layout } = useSelector((state: RootState) => state.ui)
  const [forceUpdate, setForceUpdate] = useState(0)

  // Debug logging
  console.log('Layout component - Current layout type:', layout.type)
  console.log('Layout component - Sidebar isOpen:', sidebar.isOpen)
  console.log('Layout component - Force update:', forceUpdate)

  // Force re-render when layout changes
  useEffect(() => {
    console.log('Layout useEffect - Layout changed to:', layout.type)
    setForceUpdate(prev => prev + 1)
  }, [layout.type])

  // If topbar layout is selected, use TopBarLayout
  if (layout.type === 'topbar') {
    console.log('Rendering TopBarLayout')
    return <TopBarLayout key={`topbar-${forceUpdate}`}>{children}</TopBarLayout>
  }

  // Default sidebar layout
  console.log('Rendering SidebarLayout')
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" key={`sidebar-${forceUpdate}`}>
      {/* Header - Full width at top */}
      <Header />
      
      {/* Content area - Sidebar and main content */}
      <div className="flex flex-1" style={{ height: 'calc(100vh - 65px)' }}>
        {/* Sidebar - Render for both desktop and mobile */}
        <div className={`${sidebar.isOpen ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0 border-r border-gray-200 bg-white`}>
          <Sidebar isOpen={sidebar.isOpen} />
        </div>
        
        {/* Main content area - Full height with scroll */}
        <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 65px)' }}>
          {/* Page content - Full height with vertical scroll */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout 