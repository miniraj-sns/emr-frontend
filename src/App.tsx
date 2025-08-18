import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'

// Pages
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import PatientsPage from './pages/patients/PatientsPage'
import AppointmentsPage from './pages/appointments/AppointmentsPage'
import CRMPage from './pages/crm/CRMPage'
import SettingsPage from './pages/settings/SettingsPage'

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'
import Layout from './components/layout/Layout'

// Create a client
const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/patients"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PatientsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AppointmentsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/crm"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CRMPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SettingsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  )
}

export default App 