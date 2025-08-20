import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { fetchStatistics } from '../../features/crm/crmThunks'
import { setShowLeadModal, setShowContactModal, setShowOpportunityModal, setShowFollowUpModal } from '../../features/crm/crmSlice'
import { crmService } from '../../services/crmService'

// Icons
const UsersIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
const DollarIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
const TrendingUpIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
const CalendarIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
const HeartIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
const ChartIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>

const CRMDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { statistics } = useSelector((state: RootState) => state.crm)
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      await dispatch(fetchStatistics()).unwrap()
      // Load recent activities (you can implement this later)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'lead':
        dispatch(setShowLeadModal(true))
        break
      case 'contact':
        dispatch(setShowContactModal(true))
        break
      case 'opportunity':
        dispatch(setShowOpportunityModal(true))
        break
      case 'followup':
        dispatch(setShowFollowUpModal(true))
        break
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your sales pipeline.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleQuickAction('lead')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon />
            <span className="ml-2">Add Lead</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900">{statistics?.total_leads || 0}</p>
              <p className="text-sm text-green-600 mt-1">
                +{statistics?.this_month_leads || 0} this month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UsersIcon />
            </div>
          </div>
        </div>

        {/* Total Contacts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-3xl font-bold text-gray-900">{statistics?.total_contacts || 0}</p>
              <p className="text-sm text-blue-600 mt-1">Active contacts</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UsersIcon />
            </div>
          </div>
        </div>

        {/* Total Opportunities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Opportunities</p>
              <p className="text-3xl font-bold text-gray-900">{statistics?.total_opportunities || 0}</p>
              <p className="text-sm text-green-600 mt-1">
                +{statistics?.this_month_opportunities || 0} this month
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarIcon />
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
              <p className="text-3xl font-bold text-gray-900">
                ${(statistics?.total_value || 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {statistics?.conversion_rate || 0}% conversion rate
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUpIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
              <button
                onClick={() => handleQuickAction('lead')}
                className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <UsersIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add New Lead</p>
                  <p className="text-sm text-gray-600">Create a new lead record</p>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction('contact')}
                className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <UsersIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add New Contact</p>
                  <p className="text-sm text-gray-600">Create a new contact</p>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction('opportunity')}
                className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <DollarIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Add Opportunity</p>
                  <p className="text-sm text-gray-600">Create a new sales opportunity</p>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction('followup')}
                className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
              >
                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                  <CalendarIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Schedule Follow-up</p>
                  <p className="text-sm text-gray-600">Create a new follow-up task</p>
            </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activities</h3>
                  <p className="mt-1 text-sm text-gray-500">Activities will appear here as you work with leads and contacts.</p>
                </div>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <UsersIcon />
              </div>
            </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        New lead added
                      </p>
                      <p className="text-sm text-gray-500">
                        John Doe was added as a new lead
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        2 hours ago
                      </p>
          </div>
        </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{statistics?.total_leads || 0}</p>
            <p className="text-sm text-gray-600">Leads</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-900">{statistics?.total_contacts || 0}</p>
            <p className="text-sm text-blue-600">Contacts</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-900">{statistics?.total_opportunities || 0}</p>
            <p className="text-sm text-yellow-600">Opportunities</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-900">
              ${(statistics?.total_value || 0).toLocaleString()}
            </p>
            <p className="text-sm text-green-600">Pipeline Value</p>
        </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-900">{statistics?.conversion_rate || 0}%</p>
            <p className="text-sm text-purple-600">Conversion Rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CRMDashboard
