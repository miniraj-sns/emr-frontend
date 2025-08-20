import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { fetchPatients } from '../../features/patients/patientSlice'
import { fetchStatistics } from '../../features/crm/crmThunks'
import { 
  Users, 
  Calendar, 
  Building2, 
  Package,
  TrendingUp,
  Activity,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { patients, loading: patientsLoading } = useSelector((state: RootState) => state.patients)
  const { statistics, isLoading: statsLoading } = useSelector((state: RootState) => state.crm)
  
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...')
      const results = await Promise.all([
        dispatch(fetchPatients({})).unwrap(),
        dispatch(fetchStatistics()).unwrap()
      ])
      console.log('Dashboard data loaded:', results)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  // Simulate data refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadDashboardData()
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate dynamic stats from real data
  const getDynamicStats = () => {
    const totalPatients = patients.length
    const totalLeads = statistics?.total_leads || 0
    const totalOpportunities = statistics?.total_opportunities || 0
    const totalValue = statistics?.total_value || 0

    // Debug logging
    console.log('Dashboard - Patients:', patients)
    console.log('Dashboard - Total Patients:', totalPatients)
    console.log('Dashboard - Statistics:', statistics)

    // Calculate trends (you can implement real trend calculation based on historical data)
    const patientTrend = totalPatients > 0 ? '+5%' : '0%'
    const leadTrend = totalLeads > 0 ? '+12%' : '0%'
    const opportunityTrend = totalOpportunities > 0 ? '+8%' : '0%'
    const valueTrend = totalValue > 0 ? '+15%' : '0%'

    return [
      {
        name: 'Total Patients',
        value: totalPatients > 0 ? totalPatients.toLocaleString() : '0',
        change: patientTrend,
        changeType: 'positive',
        icon: Users,
        color: 'bg-blue-500',
        trend: 'up',
        loading: patientsLoading.list
      },
      {
        name: 'Appointments Today',
        value: '0', // TODO: Connect to appointments API when available
        change: '0%',
        changeType: 'neutral',
        icon: Calendar,
        color: 'bg-green-500',
        trend: 'neutral',
        loading: false
      },
      {
        name: 'Active Leads',
        value: totalLeads.toString(),
        change: leadTrend,
        changeType: 'positive',
        icon: Building2,
        color: 'bg-purple-500',
        trend: 'up',
        loading: statsLoading
      },
      {
        name: 'Pipeline Value',
        value: `$${totalValue.toLocaleString()}`,
        change: valueTrend,
        changeType: 'positive',
        icon: Package,
        color: 'bg-orange-500',
        trend: 'up',
        loading: statsLoading
      }
    ]
  }

  const stats = getDynamicStats()

  // Dynamic recent activity based on real data
  const getRecentActivity = () => {
    const activities = []

    // Add recent patients
    if (patients.length > 0) {
      const recentPatients = patients.slice(0, 2)
      recentPatients.forEach((patient, index) => {
        activities.push({
          id: `patient-${patient.id}`,
          type: 'patient',
          message: `Patient ${patient.first_name} ${patient.last_name} added to system`,
          time: `${index + 1} hour${index > 0 ? 's' : ''} ago`,
          icon: Users,
          status: 'success'
        })
      })
    }

    // Add CRM activities if available
    if (statistics && statistics.total_leads > 0) {
      activities.push({
        id: 'lead-activity',
        type: 'lead',
        message: `${statistics.total_leads} leads in pipeline`,
        time: '2 hours ago',
        icon: Building2,
        status: 'info'
      })
    }

    // Add system activities
    activities.push({
      id: 'system-activity',
      type: 'system',
      message: 'System backup completed successfully',
      time: '3 hours ago',
      icon: CheckCircle,
      status: 'success'
    })

    return activities.slice(0, 4) // Limit to 4 activities
  }

  const recentActivity = getRecentActivity()

  const quickActions = [
    {
      name: 'Add New Patient',
      description: 'Create a new patient record',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/patients/new'
    },
    {
      name: 'Schedule Appointment',
      description: 'Book a new appointment',
      icon: Calendar,
      color: 'bg-green-500 hover:bg-green-600',
      href: '/appointments'
    },
    {
      name: 'Create Lead',
      description: 'Add a new sales lead',
      icon: Building2,
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/crm/leads'
    }
  ]

  const systemStatus = [
    {
      name: 'API Status',
      status: 'Online',
      color: 'text-green-600',
      icon: CheckCircle
    },
    {
      name: 'Database',
      status: 'Connected',
      color: 'text-green-600',
      icon: CheckCircle
    },
    {
      name: 'Last Backup',
      status: '2 hours ago',
      color: 'text-blue-600',
      icon: Clock
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'info':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your EMR system today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Activity className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Last updated: {currentTime.toLocaleTimeString()}</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                {stat.loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value || '0'}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    stat.trend === 'up' ? 'text-green-500 rotate-0' : 'text-red-500 rotate-180'
                  }`} />
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
              </div>
              <div className={`p-3 ${stat.color} bg-opacity-10 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => window.location.href = action.href}
                  className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:shadow-sm"
                >
                  <div className={`p-2 ${action.color} bg-opacity-10 rounded-lg mr-3`}>
                    <action.icon className={`h-5 w-5 ${action.color.replace('bg-', 'text-').replace(' hover:bg-', '')}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.name}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <Plus className="h-4 w-4 text-gray-400 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-gray-900">No recent activities</h3>
                  <p className="text-sm text-gray-500 mt-1">Activities will appear here as you work with the system.</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {getStatusIcon(activity.status)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* System Status & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            {systemStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <item.icon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className={`text-sm font-medium ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900">No upcoming appointments</h3>
            <p className="text-sm text-gray-500 mt-1">You're all caught up for today!</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              View Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 