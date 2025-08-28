import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store'

// Pages
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import PatientsPage from './pages/patients/PatientsPage'
import PatientDetailPage from './pages/patients/PatientDetailPage'
import PatientFormsPage from './pages/patients/PatientFormsPage'
import AppointmentsPage from './pages/appointments/AppointmentsPage'
import CalendarPage from './pages/appointments/CalendarPage'
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
              
              {/* Patient Routes */}
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
                path="/patients/new"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900">Create New Patient</h1>
                        <p className="text-gray-600 mt-2">Patient creation form coming soon...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/patients/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PatientDetailPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/patients/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Patient</h1>
                        <p className="text-gray-600 mt-2">Patient edit form coming soon...</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/patients/forms"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PatientFormsPage />
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
              
              {/* CRM Routes */}
              <Route
                path="/appointments/calendar"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CalendarPage />
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
                path="/crm/leads"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CRMPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/crm/contacts"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CRMPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/crm/opportunities"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CRMPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/crm/followups"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <CRMPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/crm/pipelines"
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
              
              {/* Catch all route - only for truly unmatched routes */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  )
}

export default App 