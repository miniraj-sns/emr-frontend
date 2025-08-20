import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { resetCRMState } from '../../features/crm/crmSlice'
import CRMDashboard from '../../components/crm/CRMDashboard'
import LeadsList from '../../components/crm/LeadsList'
import ContactsList from '../../components/crm/ContactsList'
import OpportunitiesList from '../../components/crm/OpportunitiesList'
import FollowUpsList from '../../components/crm/FollowUpsList'
import LeadFormModal from '../../components/crm/LeadFormModal'
import ContactFormModal from '../../components/crm/ContactFormModal'
import OpportunityFormModal from '../../components/crm/OpportunityFormModal'
import FollowUpFormModal from '../../components/crm/FollowUpFormModal'

type CRMView = 'dashboard' | 'leads' | 'contacts' | 'opportunities' | 'followups'

const CRMPage: React.FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeView, setActiveView] = useState<CRMView>('dashboard')

  // Reset CRM state when component unmounts
  React.useEffect(() => {
    return () => {
      dispatch(resetCRMState())
    }
  }, [dispatch])

  // Handle URL-based navigation
  useEffect(() => {
    const path = location.pathname
    console.log('CRM Page - Current path:', path) // Debug logging
    
    if (path === '/crm' || path === '/crm/dashboard') {
      setActiveView('dashboard')
    } else if (path === '/crm/leads') {
      setActiveView('leads')
    } else if (path === '/crm/opportunities') {
      setActiveView('opportunities')
    } else if (path === '/crm/contacts') {
      setActiveView('contacts')
    } else if (path === '/crm/followups') {
      setActiveView('followups')
    } else {
      // Default to dashboard for unknown routes
      setActiveView('dashboard')
    }
  }, [location.pathname])

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', path: '/crm' },
    { id: 'leads', name: 'Leads', icon: '🎯', path: '/crm/leads' },
    { id: 'contacts', name: 'Contacts', icon: '👥', path: '/crm/contacts' },
    { id: 'opportunities', name: 'Opportunities', icon: '💰', path: '/crm/opportunities' },
    { id: 'followups', name: 'Follow-ups', icon: '📅', path: '/crm/followups' },
  ]

  const handleTabClick = (tabId: CRMView) => {
    setActiveView(tabId)
    const tab = tabs.find(t => t.id === tabId)
    if (tab) {
      navigate(tab.path)
    }
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <CRMDashboard />
      case 'leads':
        return <LeadsList />
      case 'contacts':
        return <ContactsList />
      case 'opportunities':
        return <OpportunitiesList />
      case 'followups':
        return <FollowUpsList />
      default:
        return <CRMDashboard />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Relationship Management</h1>
          <p className="text-gray-600 mt-1">Manage leads, contacts, and business opportunities</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            + Quick Add
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as CRMView)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${activeView === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-96">
        {renderActiveView()}
      </div>

      {/* Modals */}
      <LeadFormModal />
      <ContactFormModal />
      <OpportunityFormModal />
      <FollowUpFormModal />
    </div>
  )
}

export default CRMPage 