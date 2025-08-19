import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebar } = useSelector((state: RootState) => state.ui)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebar.isOpen} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header />
        
        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout 