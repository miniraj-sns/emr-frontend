import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { setLayoutType, setSidebarOpen } from '../../features/ui/uiSlice'
import { Layout, LayoutGrid } from 'lucide-react'

const LayoutSwitcher: React.FC = () => {
  const dispatch = useDispatch()
  const { layout } = useSelector((state: RootState) => state.ui)

  // Log current state on mount
  useEffect(() => {
    console.log('LayoutSwitcher mounted - Current layout:', layout.type)
  }, [layout.type])

  const handleLayoutChange = (layoutType: 'sidebar' | 'topbar') => {
    console.log('LayoutSwitcher - Switching to layout:', layoutType)
    console.log('LayoutSwitcher - Current layout:', layout.type)
    
    // Add a small delay to ensure state update
    setTimeout(() => {
      dispatch(setLayoutType(layoutType))
      console.log('LayoutSwitcher - Action dispatched for:', layoutType)
      
      // Auto-manage sidebar based on layout type
      if (layoutType === 'topbar') {
        // Auto-close sidebar when switching to topbar layout
        setTimeout(() => {
          dispatch(setSidebarOpen(false))
          console.log('LayoutSwitcher - Auto-closed sidebar for topbar layout')
        }, 100)
      } else if (layoutType === 'sidebar') {
        // Auto-open sidebar when switching to sidebar layout
        setTimeout(() => {
          dispatch(setSidebarOpen(true))
          console.log('LayoutSwitcher - Auto-opened sidebar for sidebar layout')
        }, 100)
      }
    }, 50)
  }

  console.log('LayoutSwitcher render - Current layout type:', layout.type)

  return (
    <div className="flex items-center space-x-1 border-l border-gray-300 pl-4">
      <button
        onClick={() => handleLayoutChange('sidebar')}
        className={`p-2 rounded-md transition-colors ${
          layout.type === 'sidebar'
            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
            : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
        }`}
        aria-label="Sidebar layout"
        title="Sidebar Layout (Shows Sidebar)"
      >
        <Layout className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleLayoutChange('topbar')}
        className={`p-2 rounded-md transition-colors ${
          layout.type === 'topbar'
            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
            : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
        }`}
        aria-label="Top bar layout"
        title="Top Bar Layout (Shows Top Menu)"
      >
        <LayoutGrid className="h-5 w-5" />
      </button>
    </div>
  )
}

export default LayoutSwitcher
