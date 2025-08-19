import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { 
  Users, 
  Calendar, 
  Building2, 
  Package,
  TrendingUp,
  Activity
} from 'lucide-react'

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  const stats = [
    {
      name: 'Total Patients',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Appointments Today',
      value: '45',
      change: '+5%',
      changeType: 'positive',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'Active Leads',
      value: '89',
      change: '+23%',
      changeType: 'positive',
      icon: Building2,
      color: 'bg-purple-500'
    },
    {
      name: 'Inventory Items',
      value: '567',
      change: '-2%',
      changeType: 'negative',
      icon: Package,
      color: 'bg-orange-500'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'appointment',
      message: 'New appointment scheduled with John Doe',
      time: '2 minutes ago',
      icon: Calendar
    },
    {
      id: 2,
      type: 'patient',
      message: 'Patient Sarah Smith updated their profile',
      time: '15 minutes ago',
      icon: Users
    },
    {
      id: 3,
      type: 'lead',
      message: 'New lead created from website contact form',
      time: '1 hour ago',
      icon: Building2
    },
    {
      id: 4,
      type: 'inventory',
      message: 'Device shipment delivered to clinic',
      time: '2 hours ago',
      icon: Package
    }
  ]

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
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Activity className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className={`h-4 w-4 ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={`text-sm font-medium ml-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <activity.icon className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-3" />
                <span className="text-sm font-medium text-gray-900">Add New Patient</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-sm font-medium text-gray-900">Schedule Appointment</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-purple-500 mr-3" />
                <span className="text-sm font-medium text-gray-900">Create Lead</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Backup</span>
              <span className="text-sm text-gray-900">2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-500">No upcoming appointments</div>
            <button className="w-full mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              View Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage 