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
  const [timeRange, setTimeRange] = useState('all');
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
      draft: 'bg-yellow-100 text-yellow-700'
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-cyan-600"></div>
      </div>
    );
  }

  // Build key metrics from dashboard data — each carries a border/accent color
  // that acts as the at-a-glance indicator instead of relying on the arrow alone
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
      accent: 'cyan',
    },
    {
      title: 'Total Surgeries',
      value: dashboardData?.summary?.totalSurgeries || 0,
      change: `${dashboardData?.summary?.completedSurgeries || 0} completed`,
      trend: 'up',
      percentage: dashboardData?.summary?.completionRate || '0%',
      icon: Activity,
      accent: 'blue',
    },
    {
      title: 'Completed',
      value: dashboardData?.summary?.completedSurgeries || 0,
      change: 'Success rate',
      trend: 'up',
      percentage: dashboardData?.summary?.completionRate || '0%',
      icon: CheckCircle,
      accent: 'green',
    },
    {
      title: 'Draft',
      value: dashboardData?.summary?.draftSurgeries || 0,
      change: 'Pending',
      trend: dashboardData?.summary?.draftSurgeries > 0 ? 'down' : 'up',
      percentage: `${dashboardData?.summary?.draftSurgeries || 0} pending`,
      icon: Clock,
      accent: 'yellow',
    }
  ];

  const accentStyles = {
    cyan: { border: 'border-l-cyan-500', bg: 'bg-cyan-50', icon: 'text-cyan-600' },
    blue: { border: 'border-l-blue-500', bg: 'bg-blue-50', icon: 'text-blue-600' },
    green: { border: 'border-l-green-500', bg: 'bg-green-50', icon: 'text-green-600' },
    yellow: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', icon: 'text-yellow-600' },
  };

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-xs mt-0.5">Welcome back, Administrator</p>
        </div>
        <div className="mt-2 md:mt-0 flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={fetchAllData}
            className="px-4 py-1.5 text-sm bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-md transition font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics — left border color = indicator, no separate icon chip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const accent = accentStyles[metric.accent];
          return (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${accent.border} p-4 hover:shadow-md transition`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`${accent.bg} p-1.5 rounded-md`}>
                  <Icon className={`w-4 h-4 ${accent.icon}`} />
                </div>
                <div className="flex items-center space-x-1">
                  {metric.trend === 'up' ? (
                    <ArrowUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-yellow-600" />
                  )}
                  <span className={`text-xs font-semibold ${metric.trend === 'up' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {metric.percentage}
                  </span>
                </div>
              </div>
              <p className="text-gray-500 text-xs font-medium">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{metric.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{metric.change}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Surgeries */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Recent Surgeries</h2>
              <button
                onClick={() => window.location.href = '/dashboard/records'}
                className="text-cyan-600 hover:text-cyan-700 text-xs font-semibold">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentSurgeries && recentSurgeries.length > 0 ? (
              recentSurgeries.map((surgery) => (
                <div
                  key={surgery._id}
                  className="p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        DR
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-900">
                          {surgery.doctor?.doctorId || 'Unknown Doctor'}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${getStatusColor(surgery.status)}`}>
                          {surgery.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{surgery.procedure}</p>
                      {surgery.surgeryType && (
                        <p className="text-[11px] text-gray-500 mt-0.5">{surgery.surgeryType}</p>
                      )}
                      <div className="flex items-center space-x-3 mt-1.5">
                        <p className="text-[11px] text-gray-400">{surgery.surgeryId}</p>
                        <p className="text-[11px] text-gray-400">{formatDate(surgery.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-xs">No recent surgeries</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Performing Doctors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-base font-bold text-gray-900">Contributors</h2>
            <p className="text-xs text-gray-500 mt-0.5">Based on number of surgeries recorded</p>
          </div>
          <div className="p-3 space-y-2">
            {topDoctors && topDoctors.length > 0 ? (
              topDoctors.map((doctor, index) => (
                <div
                  key={doctor.doctorId}
                  className="flex items-center space-x-2.5 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      DR
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{doctor.identifier}</p>
                    <p className="text-[11px] text-gray-500">{doctor.specialty}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[11px] text-gray-600">{doctor.totalSurgeries} surgeries</span>
                      <span className="text-[11px] font-semibold text-green-600">{doctor.completionRate}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Users className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p className="text-xs">No doctor data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Surgery Trends */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Surgery Trends</h2>
          <button className="text-cyan-600 hover:text-cyan-700 text-xs font-semibold flex items-center space-x-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {trends && trends.length > 0 ? (
            trends.map((trend, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 border-l-4 border-l-cyan-400 rounded-lg hover:shadow-sm transition"
              >
                <p className="text-[11px] font-semibold text-gray-500 mb-1">{trend.period}</p>
                <p className="text-xl font-bold text-gray-900">{trend.total}</p>
                <div className="mt-1.5 space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Complete</span>
                    <span className="font-semibold text-green-600">{trend.complete}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Draft</span>
                    <span className="font-semibold text-yellow-600">{trend.draft}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-6 p-6 text-center text-gray-500">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs">No trend data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Location Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Surgeries by Country</h2>
          <MapPin className="w-4 h-4 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {locationStats && locationStats.length > 0 ? (
            locationStats.slice(0, 6).map((location, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 border-l-4 border-l-blue-400 rounded-lg hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-700">{location.country}</p>
                  <span className="text-[11px] font-semibold text-green-600">{location.completionRate}%</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{location.totalSurgeries}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {location.completedSurgeries} completed
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-6 text-center text-gray-500">
              <MapPin className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-xs">No location data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Procedures */}
      {dashboardData?.topProcedures && dashboardData.topProcedures.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-base font-bold text-gray-900 mb-3">Top Procedures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {dashboardData.topProcedures.slice(0, 5).map((procedure, index) => (
              <div
                key={index}
                className="p-3 bg-cyan-50 rounded-lg border border-cyan-200 border-l-4 border-l-cyan-500"
              >
                <p className="text-xs font-semibold text-gray-700 mb-1 truncate">{procedure.name}</p>
                <p className="text-2xl font-bold text-cyan-700">{procedure.value}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">surgeries</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <button
          onClick={() => window.location.href = '/dashboard/manage-doctors'}
          className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-4 rounded-lg hover:shadow-lg transition transform hover:-translate-y-0.5 text-left"
        >
          <Users className="w-6 h-6 mb-2" />
          <h3 className="font-bold text-sm">Manage Doctors</h3>
          <p className="text-cyan-100 text-xs mt-0.5">View and manage all doctors</p>
        </button>

        <button
          onClick={() => window.location.href = '/dashboard/records'}
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition transform hover:-translate-y-0.5 text-left"
        >
          <FileText className="w-6 h-6 mb-2" />
          <h3 className="font-bold text-sm">Surgery Records</h3>
          <p className="text-blue-100 text-xs mt-0.5">Access all surgery records</p>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;