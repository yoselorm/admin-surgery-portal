import React, { useEffect, useState } from 'react';
import {
  Search,
  Download,
  Eye,
  Calendar,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { exportToCSV } from '../utils/Helper';
import { exportFilteredSurgeries, fetchSurgeries } from '../redux/SurgerySlice';
import ExportFilterModal from '../components/ExportFilterModal';
import axios from 'axios';
import toast from '../components/Toast';

const AdminSurgeryRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const { admin } = useSelector((state) => state.auth)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { surgeries, loading, total, page: currentPage, pages, limit } = useSelector(
    (state) => state.surgeries
  );

  useEffect(() => {
    dispatch(fetchSurgeries({ status: filterStatus, page, limit: 10 }));
  }, [dispatch, filterStatus, page]);

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
    setPage(1);
  };

  const handleExportWithFilters = async (exportConfig) => {
    try {
      const result = await dispatch(exportFilteredSurgeries({
        procedure: exportConfig.procedure,
        filters: exportConfig.filters
      })).unwrap();
  
      const filteredData = result.data;
      const fileName = `${exportConfig.procedure}_surgery_records_${new Date().toISOString().split('T')[0]}.csv`;
      exportToCSV(filteredData, fileName);
      
      toast.success(`Successfully exported ${filteredData.length} records!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'complete':
        return 'green';
      case 'follow-ups':
      case 'in progress':
        return 'blue';
      case 'draft':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const filteredRecords = surgeries?.filter((r) => {
    const term = searchTerm?.toLowerCase();
    if (!term) return true;
    return (
      r.surgeryId?.toLowerCase().includes(term) ||
      r.patientName?.toLowerCase().includes(term) ||
      r.procedure?.toLowerCase().includes(term) ||
      r.doctor?.fullname?.toLowerCase().includes(term)
    );
  });

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
      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${colors[color]}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Surgery Records</h1>
          <p className="text-gray-600 text-xs mt-0.5">Manage and view all surgical procedures</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, procedure, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={handleStatusChange}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Status</option>
            <option value="complete">Completed</option>
            <option value="draft">Draft</option>
            <option value="follow-ups">Follow ups</option>
          </select>

          {/* Export Button - Opens Modal */}
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center justify-center space-x-1.5 px-3 py-1.5 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Export Filter Modal */}
      <ExportFilterModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportWithFilters}
      />

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Record ID
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Procedure
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords?.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="font-semibold text-cyan-600 text-xs">{record.surgeryId}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-xs">{record.patientName}</p>
                      <p className="text-[11px] text-gray-500">
                        {record.patientAge} years old • {record.gender}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <p className="font-medium text-gray-900 text-xs">{record.procedure}</p>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-xs text-gray-700">{record.surgeryType}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-1.5 text-xs text-gray-700">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formatDate(record.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formatTime(record.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => navigate(`/dashboard/records/${record._id}`)}
                        className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRecords?.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-1.5">
                      <Search className="w-10 h-10 text-gray-300" />
                      <p className="font-medium text-sm">No records found</p>
                      <p className="text-xs">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-xs text-gray-600">
            Showing <span className="font-semibold">
              {total === 0 ? 0 : (currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, total)}
            </span> of{' '}
            <span className="font-semibold">{total}</span> records
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white transition text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-xs font-medium">
              {currentPage}
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pages || 1, p + 1))}
              disabled={currentPage >= pages}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-white transition text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSurgeryRecords;