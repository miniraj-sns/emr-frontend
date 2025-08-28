import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { setLayoutType } from '../../features/ui/uiSlice'
import { Layout, LayoutGrid } from 'lucide-react'

const LayoutSwitcher: React.FC = () => {
  const dispatch = useDispatch()
  const { layout } = useSelector((state: RootState) => state.ui)

  const handleLayoutChange = (layoutType: 'sidebar' | 'topbar') => {
    dispatch(setLayoutType(layoutType))
  }

  return (
    <div className="flex items-center space-x-1 border-l border-gray-300 pl-4">
      <button
        onClick={() => handleLayoutChange('sidebar')}
        className={`p-2 rounded-md transition-colors ${
          layout.type === 'sidebar'
            ? 'bg-primary-100 text-primary-700'
            : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
        }`}
        aria-label="Sidebar layout"
        title="Sidebar Layout"
      >
        <Layout className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleLayoutChange('topbar')}
        className={`p-2 rounded-md transition-colors ${
          layout.type === 'topbar'
            ? 'bg-primary-100 text-primary-700'
            : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
        }`}
        aria-label="Top bar layout"
        title="Top Bar Layout"
      >
        <LayoutGrid className="h-5 w-5" />
      </button>
    </div>
  )
}

export default LayoutSwitcher
