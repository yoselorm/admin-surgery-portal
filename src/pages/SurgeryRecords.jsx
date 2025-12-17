import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Download,
  Eye,
  Calendar,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { exportToCSV } from '../utils/Helper';
import { fetchSurgeries } from '../redux/SurgerySlice';

const AdminSurgeryRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSurgeries());
  }, [dispatch]);



  const { surgeries,loading } = useSelector((state) => state.surgeries);

  const handleExport = () => {
    exportToCSV(surgeries, "all_surgery_records.csv");
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time helper
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get status color mapping
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'complete':
        return 'green';
      case 'in-progress':
      case 'in progress':
        return 'blue';
      case 'scheduled':
        return 'yellow';
      case 'incomplete':
        return 'red';
      default:
        return 'gray';
    }
  };

  const filteredRecords = surgeries
    ?.filter((r) => {
      const term = searchTerm?.toLowerCase();
      return (
        r.surgeryId?.toLowerCase().includes(term) ||
        r.patientName?.toLowerCase().includes(term) ||
        r.procedure?.toLowerCase().includes(term)||
        r.doctorId?.toLowerCase().includes(term)
      );
    })
    .filter((r) =>
      filterStatus === "all"
        ? true
        : r.status?.toLowerCase() === filterStatus.toLowerCase()
    );

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    const colors = {
      green: 'bg-green-100 text-green-700 border-green-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[color]}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
   

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Surgery Records</h1>
          <p className="text-gray-600 mt-1">Manage and view all surgical procedures</p>
        </div>
       
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, procedure, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
            <option value="in-progress">In Progress</option>
            <option value="scheduled">Scheduled</option>
          </select>

          {/* Export Button */}
          <button 
            onClick={handleExport}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Record ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Procedure
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords?.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-cyan-600">{record.surgeryId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{record.patientName}</p>
                      <p className="text-sm text-gray-500">
                        {record.patientAge} years old • {record.gender}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{record.procedure}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{record.surgeryType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(record.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{formatTime(record.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/dashboard/records/${record._id}`)}
                        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRecords?.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-12 text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Search className="w-12 h-12 text-gray-300" />
                      <p className="font-medium">No records found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">1-{Math.min(filteredRecords?.length || 0, 10)}</span> of{' '}
            <span className="font-semibold">{filteredRecords?.length || 0}</span> records
          </p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition text-sm font-medium">
              Previous
            </button>
            <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition text-sm font-medium">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSurgeryRecords;