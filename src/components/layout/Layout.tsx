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
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebar.isOpen} />
      <div className={`transition-all duration-300 ${sidebar.isOpen ? 'ml-64' : 'ml-0'}`}>
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout 