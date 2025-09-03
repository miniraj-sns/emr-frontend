import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

interface UIState {
  sidebar: {
    isOpen: boolean
  }
  layout: {
    type: 'sidebar' | 'topbar' // sidebar = current layout, topbar = only top navigation
  }
  modals: {
    [key: string]: boolean
  }
  notifications: Notification[]
  theme: 'light' | 'dark'
}

const initialState: UIState = {
  sidebar: {
    isOpen: true, // Start with sidebar open for sidebar layout
  },
  layout: {
    type: 'sidebar' // Default to sidebar layout
  },
  modals: {},
  notifications: [],
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isOpen = action.payload
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    setLayoutType: (state, action: PayloadAction<'sidebar' | 'topbar'>) => {
      state.layout.type = action.payload
    }
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  setTheme,
  setLayoutType,
} = uiSlice.actions

export default uiSlice.reducer 