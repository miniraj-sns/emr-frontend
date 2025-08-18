import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Header</h2>
          <div className="text-gray-600">Header content will be implemented here</div>
        </div>
      </div>
    </header>
  )
}

export default Header 