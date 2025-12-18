import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Activity,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp,
  FileText,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';
import { fetchSurgeriesByDoctor } from '../redux/SurgerySlice';

const DoctorSurgeryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Redux state - adjust according to your actual Redux state structure
  const { doctorSurgeries, doctor, loading, error } = useSelector((state) => state.surgeries);

  useEffect(() => {
    if (id) {
      dispatch(fetchSurgeriesByDoctor(id));
    }
  }, [id, dispatch]);

  // Doctor info comes separately from API
  const doctorData = doctor;

  // Calculate statistics
  const stats = {
    total: doctorSurgeries?.length || 0,
    completed: doctorSurgeries?.filter(s => s.status === 'complete').length || 0,
    incomplete: doctorSurgeries?.filter(s => s.status === 'incomplete').length || 0,
    completionRate: doctorSurgeries?.length > 0 
      ? ((doctorSurgeries.filter(s => s.status === 'complete').length / doctorSurgeries.length) * 100).toFixed(1)
      : 0
  };

  // Filter and sort doctorSurgeries
  const filteredSurgeries = doctorSurgeries
    ?.filter(surgery => {
      const matchesSearch = surgery.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          surgery.surgeryId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || surgery.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'procedure':
          return a.procedure.localeCompare(b.procedure);
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      complete: { label: 'Complete', className: 'bg-green-100 text-green-700' },
      incomplete: { label: 'Incomplete', className: 'bg-yellow-100 text-yellow-700' }
    };
    const statusConfig = config[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.className}`}>
        {statusConfig.label}
      </span>
    );
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'DR';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!doctorData && doctorSurgeries?.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Found</h2>
          <p className="text-gray-600 mb-4">This doctor has no surgery records yet.</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
            <p className="text-gray-600 mt-1">View all Surgeries and performance metrics</p>
          </div>
        </div>

        {/* Doctor Info Card - Now with full data from API */}
        {doctorData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {getInitials(doctorData.fullname || doctorData.doctorId)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {doctorData.doctorId}
                  </h2>
                  {doctorData.specialty && (
                    <p className="text-cyan-600 font-medium mt-1">{doctorData.specialty}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">ID: {doctorData.doctorId}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                    {doctorData.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{doctorData.email}</span>
                      </div>
                    )}
                    {doctorData.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{doctorData.phone}</span>
                      </div>
                    )}
                    {doctorData.city && doctorData.country && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{doctorData.city}, {doctorData.country}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                {doctorData.status && (
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    doctorData.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {doctorData.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                )}
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-cyan-100 text-cyan-700">
                  {stats.total} Surgeries
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Surgeries</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Incomplete</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.incomplete}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completionRate}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by procedure or surgery ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Status</option>
                <option value="complete">Complete</option>
                <option value="incomplete">Incomplete</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
              </select>

              {/* <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* doctorSurgeries List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Surgery Records</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredSurgeries?.length || 0} of {stats.total} Surgeries
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredSurgeries && filteredSurgeries.length > 0 ? (
              filteredSurgeries.map((surgery) => (
                <div
                  key={surgery._id}
                  className="p-6 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => navigate(`/dashboard/records/${surgery._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-bold text-gray-900 text-lg">{surgery.procedure}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{surgery.surgeryId}</span>
                      </div>
                      
                      {surgery.surgeryType && (
                        <p className="text-gray-600 text-sm mb-2">{surgery.surgeryType}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Surgery: {formatDate(surgery.date)}</span>
                        </div>
                        <span>•</span>
                        <span>Created: {formatDate(surgery.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {getStatusBadge(surgery.status)}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/records/${surgery._id}`);
                        }}
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No Surgeries found</p>
                <p className="text-sm mt-1">Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSurgeryPage;