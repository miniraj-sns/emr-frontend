import React from 'react'
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

  // If topbar layout is selected, use TopBarLayout
  if (layout.type === 'topbar') {
    return <TopBarLayout>{children}</TopBarLayout>
  }

  // Default sidebar layout
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Full width at top */}
      <Header />
      
      {/* Content area - Sidebar and main content */}
      <div className="flex flex-1" style={{ height: 'calc(100vh - 65px)' }}>
        {/* Sidebar - Only render when open on desktop */}
        {sidebar.isOpen && (
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar isOpen={true} />
          </div>
        )}
        
        {/* Mobile sidebar - Always render but controlled by isOpen */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebar.isOpen} />
        </div>
        
        {/* Main content area - Full height with scroll */}
        <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 65px)' }}>
          {/* Page content - Full height with vertical scroll */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-4 w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout 