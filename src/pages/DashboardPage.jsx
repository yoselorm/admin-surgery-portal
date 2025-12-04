import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Hospital,
  UserCheck,
  BarChart3,
  Eye,
  MoreVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Key Metrics
  const keyMetrics = [
    {
      title: 'Total Doctors',
      value: '156',
      change: '+12',
      trend: 'up',
      percentage: '+8.3%',
      icon: Users,
      color: 'cyan',
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Total Surgeries',
      value: '2,847',
      change: '+234',
      trend: 'up',
      percentage: '+9.1%',
      icon: Activity,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Patients',
      value: '1,452',
      change: '+89',
      trend: 'up',
      percentage: '+6.5%',
      icon: UserCheck,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'System Uptime',
      value: '99.8%',
      change: '+0.2%',
      trend: 'up',
      percentage: 'Excellent',
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      action: 'Created new surgery record',
      procedure: 'Cardiac Bypass',
      time: '5 minutes ago',
      status: 'completed',
      avatar: 'SJ'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      action: 'Updated patient information',
      procedure: 'Hip Replacement',
      time: '12 minutes ago',
      status: 'updated',
      avatar: 'MC'
    },
    {
      id: 3,
      doctor: 'Dr. Emily Smith',
      action: 'Scheduled new surgery',
      procedure: 'Appendectomy',
      time: '23 minutes ago',
      status: 'scheduled',
      avatar: 'ES'
    },
    {
      id: 4,
      doctor: 'Dr. Robert Brown',
      action: 'Completed surgery record',
      procedure: 'Knee Replacement',
      time: '1 hour ago',
      status: 'completed',
      avatar: 'RB'
    },
    {
      id: 5,
      doctor: 'Dr. Lisa Anderson',
      action: 'Added new patient',
      procedure: 'Cataract Surgery',
      time: '2 hours ago',
      status: 'new',
      avatar: 'LA'
    }
  ];

  // Top Performing Doctors
  const topDoctors = [
    {
      name: 'Dr. John Doe',
      specialty: 'Cardiac Surgery',
      surgeries: 127,
      successRate: 98.4,
      avatar: 'JD'
    },
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Neurosurgery',
      surgeries: 98,
      successRate: 97.9,
      avatar: 'SJ'
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Orthopedic',
      surgeries: 145,
      successRate: 99.1,
      avatar: 'MC'
    },
    {
      name: 'Dr. Emily Smith',
      specialty: 'General Surgery',
      surgeries: 112,
      successRate: 98.2,
      avatar: 'ES'
    },
    {
      name: 'Dr. Robert Brown',
      specialty: 'Vascular Surgery',
      surgeries: 89,
      successRate: 97.5,
      avatar: 'RB'
    }
  ];

  // Department Statistics
  const departmentStats = [
    { department: 'Cardiology', surgeries: 456, trend: 'up', change: '+12%' },
    { department: 'Orthopedics', surgeries: 523, trend: 'up', change: '+18%' },
    { department: 'Neurology', surgeries: 342, trend: 'down', change: '-3%' },
    { department: 'General Surgery', surgeries: 678, trend: 'up', change: '+25%' },
    { department: 'ENT', surgeries: 234, trend: 'up', change: '+8%' }
  ];

  // System Alerts
  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: '3 pending surgery approvals require attention',
      time: '10 min ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'System maintenance scheduled for tomorrow',
      time: '1 hour ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Database backup completed successfully',
      time: '3 hours ago'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-700',
      updated: 'bg-blue-100 text-blue-700',
      scheduled: 'bg-yellow-100 text-yellow-700',
      new: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Administrator</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-medium">
            Generate Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${metric.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {metric.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.percentage}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
              <p className="text-sm text-gray-500 mt-2">
                {metric.change} from last {timeRange}
              </p>
            </div>
          );
        })}
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Alerts</h2>
        <div className="space-y-3">
          {systemAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              <button className="text-cyan-600 hover:text-cyan-700 text-sm font-semibold">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {activity.avatar}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{activity.doctor}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">{activity.procedure}</p>
                    <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Doctors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Top Doctors</h2>
            <p className="text-sm text-gray-500 mt-1">Based on surgeries and success rate</p>
          </div>
          <div className="p-4 space-y-4">
            {topDoctors.map((doctor, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {doctor.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{doctor.name}</p>
                  <p className="text-xs text-gray-500">{doctor.specialty}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-gray-600">{doctor.surgeries} surgeries</span>
                    <span className="text-xs font-semibold text-green-600">{doctor.successRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Department Performance</h2>
          <button className="text-cyan-600 hover:text-cyan-700 text-sm font-semibold flex items-center space-x-1">
            <BarChart3 className="w-4 h-4" />
            <span>View Analytics</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {departmentStats.map((dept, index) => (
            <div
              key={index}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-cyan-400 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">{dept.department}</p>
                {dept.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{dept.surgeries}</p>
              <p className={`text-xs font-semibold mt-1 ${dept.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {dept.change} vs last period
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-xl transition transform hover:-translate-y-1 text-left">
          <Users className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg">Manage Doctors</h3>
          <p className="text-cyan-100 text-sm mt-1">View and manage all doctors</p>
        </button>

        <button className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-xl transition transform hover:-translate-y-1 text-left">
          <FileText className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg">Surgery Records</h3>
          <p className="text-blue-100 text-sm mt-1">Access all surgery records</p>
        </button>

        <button className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-xl hover:shadow-xl transition transform hover:-translate-y-1 text-left">
          <Hospital className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg">System Settings</h3>
          <p className="text-purple-100 text-sm mt-1">Configure system preferences</p>
        </button>

        <button className="bg-gradient-to-br from-green-500 to-cyan-600 text-white p-6 rounded-xl hover:shadow-xl transition transform hover:-translate-y-1 text-left">
          <BarChart3 className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg">Analytics</h3>
          <p className="text-green-100 text-sm mt-1">View detailed reports</p>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;