import React, { useEffect, useState } from 'react';
import {
    Search,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    UserPlus,
    User,
    Stethoscope,
    ChevronDown,
    CheckCircle,
    XCircle,
    Eye
} from 'lucide-react';
import AddEditDoctor from '../components/AddEditDoctor';
import { getAllDoctors } from '../redux/DoctorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ManageDoctorsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const dispatch = useDispatch();

    const { doctors, loading, error } = useSelector(
        (state) => state.doctor
    );


    useEffect(() => {
        dispatch(getAllDoctors());
    }, [dispatch]);


    const filteredDoctors = doctors?.filter((doctor) => {
        const matchesSearch =
            doctor?.doctorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor?.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || doctor.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

 
      

    {
        error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg m-4">
                {error}
            </div>
        )
    }


    // const filteredDoctors = doctors.filter((doctor) => {
    //     const matchesSearch =
    //         doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    //     const matchesStatus =
    //         filterStatus === 'all' || doctor.status === filterStatus;

    //     return matchesSearch && matchesStatus;
    // });

    const handleEditDoctor = (doctor) => {
        setModalMode("edit");
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    const getStatusBadge = (status) => {
        if (status === 'active') {
            return (
                <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Active
                </span>
            );
        }
        return (
            <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                Inactive
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
        <div className="p-6 bg-gray-50 min-h-screen ">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Doctors</h1>
                    <p className="text-gray-600 mt-1">View, add, and manage all doctors</p>
                </div>
                <button
                    className="mt-4 md:mt-0 flex items-center px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
                    onClick={() => {
                        setModalMode("add");
                        setSelectedDoctor(null);
                        setIsModalOpen(true);
                    }}
                >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add New Doctor
                </button>

            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">

                    {/* Search */}
                    <div className="relative w-full md:w-1/3">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter by Status */}
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>

                </div>
            </div>

            {/* Doctors Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
                <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Doctor List</h2>
                    <span className="text-sm text-gray-500">{filteredDoctors.length} results</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Doctor</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Specialty</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Email</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Phone</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredDoctors?.map((doctor) => (
                                <tr key={doctor._id} className="hover:bg-gray-50 transition">

                                    {/* Doctor Info */}
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {doctor.fullname
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{doctor.doctorId}</p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">{doctor.specialty}</td>
                                    <td className="px-6 py-4 text-gray-600">{doctor.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{doctor.phone}</td>

                                    {/* Status */}
                                    <td className="px-6 py-4">{getStatusBadge(doctor.status)}</td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEditDoctor(doctor)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <Link
                                                to={`/dashboard/doctor/${doctor._id}`}
                                                className="p-2 text-green-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddEditDoctor
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                doctors={doctors}
                mode={modalMode}
                initialData={selectedDoctor}
            />
        </div>
    );
};

export default ManageDoctorsPage;
