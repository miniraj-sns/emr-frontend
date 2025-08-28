import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import TopBarHeader from './TopBarHeader'

interface TopBarLayoutProps {
  children: React.ReactNode
}

const TopBarLayout: React.FC<TopBarLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with integrated navigation */}
      <TopBarHeader />
      
      {/* Main content area - Full width */}
      <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 65px)' }}>
        {/* Page content - Full height with vertical scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-4 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default TopBarLayout
