import React from 'react'

interface SidebarProps {
  isOpen: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">MindBrite EMR</h1>
      </div>
      <nav className="mt-6">
        <div className="px-6 py-2 text-sm font-medium text-gray-500">Navigation</div>
        <div className="px-6 py-2 text-gray-600">Sidebar navigation will be implemented here</div>
      </nav>
    </div>
  )
}

export default Sidebar 