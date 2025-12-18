import React, { useState, useEffect } from 'react';
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
  Hospital,
  UserCheck,
  BarChart3,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  MapPin
} from 'lucide-react';
import axios from 'axios';
import api from '../utils/api';
import { api_url_v1 } from '../utils/config';

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [locationStats, setLocationStats] = useState([]);
  const [recentSurgeries, setRecentSurgeries] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  const fetchAllData = async () => {
    try {
      setLoading(true);


      const [dashResponse, trendsResponse, doctorsResponse, locationResponse, surgeriesResponse] = await Promise.all([
        api.get(`${api_url_v1}/analytics/dashboard?timeRange=${timeRange}`),
        api.get(`${api_url_v1}/analytics/trends?period=month&count=6`,),
        api.get(`${api_url_v1}/analytics/doctor-performance?limit=5`,),
        api.get(`${api_url_v1}/analytics/location-stats`),
        api.get(`${api_url_v1}/analytics/recent-surgeries?limit=5`)
      ]);

      setDashboardData(dashResponse.data.data);
      setTrends(trendsResponse.data.data);
      setTopDoctors(doctorsResponse.data.data);
      setLocationStats(locationResponse.data.data);
      setRecentSurgeries(surgeriesResponse.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      complete: 'bg-green-100 text-green-700',
      incomplete: 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600"></div>
      </div>
    );
  }

  // Build key metrics from dashboard data
  const keyMetrics = [
    {
      title: 'Total Doctors',
      value: dashboardData?.summary?.totalDoctors || 0,
      change: `${dashboardData?.summary?.activeDoctors || 0} active`,
      trend: 'up',
      percentage: dashboardData?.summary?.activeDoctors
        ? `${((dashboardData.summary.activeDoctors / dashboardData.summary.totalDoctors) * 100).toFixed(0)}%`
        : '0%',
      icon: Users,
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Total Surgeries',
      value: dashboardData?.summary?.totalSurgeries || 0,
      change: `${dashboardData?.summary?.completedSurgeries || 0} completed`,
      trend: 'up',
      percentage: dashboardData?.summary?.completionRate || '0%',
      icon: Activity,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Completed',
      value: dashboardData?.summary?.completedSurgeries || 0,
      change: 'Success rate',
      trend: 'up',
      percentage: dashboardData?.summary?.completionRate || '0%',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Incomplete',
      value: dashboardData?.summary?.incompleteSurgeries || 0,
      change: 'Pending',
      trend: dashboardData?.summary?.incompleteSurgeries > 0 ? 'down' : 'up',
      percentage: `${dashboardData?.summary?.incompleteSurgeries || 0} pending`,
      icon: Clock,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

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
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={fetchAllData}
            className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-medium"
          >
            Refresh Data
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
                    <ArrowDown className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {metric.percentage}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
              <p className="text-sm text-gray-500 mt-2">{metric.change}</p>
            </div>
          );
        })}
      </div>



      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Surgeries */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Surgeries</h2>
              <button
                onClick={() => window.location.href = '/dashboard/records'}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-semibold">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentSurgeries && recentSurgeries.length > 0 ? (
              recentSurgeries.map((surgery) => (
                <div
                  key={surgery._id}
                  className="p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        DR
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">
                          {surgery.doctor?.doctorId || 'Unknown Doctor'}
                        </p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(surgery.status)}`}>
                          {surgery.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{surgery.procedure}</p>
                      {surgery.surgeryType && (
                        <p className="text-sm text-gray-500 mt-1">{surgery.surgeryType}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        <p className="text-xs text-gray-500">{surgery.surgeryId}</p>
                        <p className="text-xs text-gray-500">{formatDate(surgery.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No recent surgeries</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Doctors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Top Doctors</h2>
            <p className="text-sm text-gray-500 mt-1">Based on performance</p>
          </div>
          <div className="p-4 space-y-4">
            {topDoctors && topDoctors.length > 0 ? (
              topDoctors.map((doctor, index) => (
                <div
                  key={doctor.doctorId}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(doctor?.fullname)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{doctor.identifier}</p>
                    <p className="text-xs text-gray-500">{doctor.specialty}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-gray-600">{doctor.totalSurgeries} surgeries</span>
                      <span className="text-xs font-semibold text-green-600">{doctor.completionRate}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No doctor data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Surgery Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Surgery Trends</h2>
          <button className="text-cyan-600 hover:text-cyan-700 text-sm font-semibold flex items-center space-x-1">
            <BarChart3 className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trends && trends.length > 0 ? (
            trends.map((trend, index) => (
              <div
                key={index}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-cyan-400 transition"
              >
                <p className="text-xs font-semibold text-gray-700 mb-2">{trend.period}</p>
                <p className="text-2xl font-bold text-gray-900">{trend.total}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Complete:</span>
                    <span className="font-semibold text-green-600">{trend.complete}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Incomplete:</span>
                    <span className="font-semibold text-yellow-600">{trend.incomplete}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-6 p-8 text-center text-gray-500">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No trend data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Location Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Surgeries by Country</h2>
          <MapPin className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locationStats && locationStats.length > 0 ? (
            locationStats.slice(0, 6).map((location, index) => (
              <div
                key={index}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-cyan-400 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">{location.country}</p>
                  <span className="text-xs font-semibold text-green-600">{location.completionRate}%</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{location.totalSurgeries}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {location.completedSurgeries} completed
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-8 text-center text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No location data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Procedures */}
      {dashboardData?.topProcedures && dashboardData.topProcedures.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Procedures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {dashboardData.topProcedures.slice(0, 5).map((procedure, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200"
              >
                <p className="text-sm font-semibold text-gray-700 mb-2 truncate">{procedure.name}</p>
                <p className="text-3xl font-bold text-cyan-700">{procedure.value}</p>
                <p className="text-xs text-gray-600 mt-1">surgeries</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => window.location.href = '/dashboard/manage-doctors'}
          className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-xl transition transform hover:-translate-y-1 text-left"
        >
          <Users className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg">Manage Doctors</h3>
          <p className="text-cyan-100 text-sm mt-1">View and manage all doctors</p>
        </button>

        <button
          onClick={() => window.location.href = '/dashboard/records'}
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-xl hover:shadow-xl transition transform hover:-translate-y-1 text-left"
        >
          <FileText className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg">Surgery Records</h3>
          <p className="text-blue-100 text-sm mt-1">Access all surgery records</p>
        </button>

        {/* <button
          onClick={() => window.location.href = '/admin/settings'}
          className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-xl hover:shadow-xl transition transform hover:-translate-y-1 text-left"
        >
          <Hospital className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg">System Settings</h3>
          <p className="text-purple-100 text-sm mt-1">Configure system preferences</p>
        </button>

        <button
          onClick={() => window.location.href = '/admin/analytics'}
          className="bg-gradient-to-br from-green-500 to-cyan-600 text-white p-6 rounded-xl hover:shadow-xl transition transform hover:-translate-y-1 text-left"
        >
          <BarChart3 className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg">Analytics</h3>
          <p className="text-green-100 text-sm mt-1">View detailed reports</p>
        </button> */}
      </div>
    </div>
  );
};

export default DashboardPage;