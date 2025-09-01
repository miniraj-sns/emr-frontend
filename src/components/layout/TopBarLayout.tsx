import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import TopBarHeader from './TopBarHeader'
import Sidebar from './Sidebar'

interface TopBarLayoutProps {
  children: React.ReactNode
}

const TopBarLayout: React.FC<TopBarLayoutProps> = ({ children }) => {
  const { sidebar, layout } = useSelector((state: RootState) => state.ui)
  const [forceUpdate, setForceUpdate] = useState(0)

  console.log('TopBarLayout - Sidebar isOpen:', sidebar.isOpen)
  console.log('TopBarLayout - Force update:', forceUpdate)

  // Force re-render when layout changes
  useEffect(() => {
    console.log('TopBarLayout useEffect - Layout changed to:', layout.type)
    setForceUpdate(prev => prev + 1)
  }, [layout.type])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" key={`topbar-layout-${forceUpdate}`}>
      {/* Header with integrated navigation */}
      <TopBarHeader />
      
      {/* Main content area - Full width with optional sidebar */}
      <div className="flex flex-1" style={{ height: 'calc(100vh - 65px)' }}>
        {/* Sidebar - Only render when open */}
        {sidebar.isOpen && (
          <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white shadow-lg">
            <Sidebar isOpen={true} />
          </div>
        )}
        
        {/* Main content area - Full height with scroll */}
        <div className={`flex-1 flex flex-col ${sidebar.isOpen ? '' : 'w-full'}`} style={{ height: 'calc(100vh - 65px)' }}>
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

export default TopBarLayout
