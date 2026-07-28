import React, { useEffect, useState } from "react";
import {
  Search,
  UserPlus,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import AddEditDoctor from "../components/AddEditDoctor";
import { getAllDoctors } from "../redux/DoctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ManageDoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPasswordUpdate, setFilterPasswordUpdate] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const dispatch = useDispatch();
  const { doctors, loading, error } = useSelector((state) => state.doctor);
  const { admin } = useSelector((state) => state.auth);
  const isSuperAdmin = admin?.role === "super-admin";

  useEffect(() => {
    dispatch(getAllDoctors());
  }, [dispatch]);

  const filteredDoctors = doctors
    ?.filter((doctor) => {
      const matchesSearch =
        doctor?.doctorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor?.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || doctor.status === filterStatus;

      const matchesPasswordUpdate =
        !isSuperAdmin ||
        filterPasswordUpdate === "all" ||
        (filterPasswordUpdate === "updated" && doctor.updatePassword === true) ||
        (filterPasswordUpdate === "pending" && doctor.updatePassword !== true);

      return matchesSearch && matchesStatus && matchesPasswordUpdate;
    })
    ?.slice()
    ?.sort((a, b) => {
      if (!isSuperAdmin) return 0;
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const handleEditDoctor = (doctor) => {
    setModalMode("edit");
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className="px-2 py-0.5 text-[11px] font-semibold bg-green-100 text-green-700 rounded-full flex items-center gap-1 w-fit">
          <CheckCircle className="w-3 h-3" />
          Active
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-[11px] font-semibold bg-red-100 text-red-700 rounded-full flex items-center gap-1 w-fit">
        <XCircle className="w-3 h-3" />
        Inactive
      </span>
    );
  };

  const getPasswordUpdateBadge = (updatePassword) => {
    if (updatePassword) {
      return (
        <span className="px-2 py-0.5 text-[11px] font-semibold bg-green-100 text-green-700 rounded-full flex items-center gap-1 w-fit">
          <KeyRound className="w-3 h-3" />
          Updated
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-700 rounded-full flex items-center gap-1 w-fit">
        <ShieldAlert className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
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
    <div className="h-screen flex flex-col p-4 bg-gray-50">
      {/* Header — fixed, does not scroll */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between shrink-0 mb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="text-xs text-gray-500">View, add, and manage all doctors</p>
        </div>
        <button
          className="mt-2 md:mt-0 flex items-center px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-md transition font-semibold text-sm"
          onClick={() => {
            setModalMode("add");
            setSelectedDoctor(null);
            setIsModalOpen(true);
          }}
        >
          <UserPlus className="w-4 h-4 mr-1.5" />
          Add New Doctor
        </button>
      </div>

      {error && (
        <div className="p-2 mb-3 bg-red-100 text-red-700 rounded-lg text-sm shrink-0">
          {error}
        </div>
      )}

      {/* Filters — fixed, does not scroll */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 shrink-0 mb-3">
        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <select
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {isSuperAdmin && (
              <select
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                value={filterPasswordUpdate}
                onChange={(e) => setFilterPasswordUpdate(e.target.value)}
              >
                <option value="all">All Passwords</option>
                <option value="updated">Password Updated</option>
                <option value="pending">Password Pending</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Table container — this is the ONLY scrollable region */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 min-h-0 flex flex-col">
        <div className="px-4 py-2.5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-gray-900">Doctor List</h2>
          <span className="text-xs text-gray-500">
            {filteredDoctors.length} results
          </span>
        </div>

        <div className="overflow-auto flex-1 min-h-0">
          <table className="w-full table-auto border-collapse text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Specialty
                </th>
                {isSuperAdmin && (
                  <>
                    <th className="px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th
                      className="px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none"
                      onClick={toggleSortOrder}
                      title="Click to toggle sort order"
                    >
                      <span className="flex items-center gap-1">
                        Created
                        {sortOrder === "desc" ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronUp className="w-3 h-3" />
                        )}
                      </span>
                    </th>
                    <th className="px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                      Password
                    </th>
                  </>
                )}
                <th className="px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-[11px] font-semibold text-gray-600 uppercase tracking-wider text-right pr-6">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredDoctors?.map((doctor) => (
                <tr
                  key={doctor._id}
                  className="hover:bg-gray-50/70 transition-colors group"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-[10px] uppercase tracking-wider shadow-sm shrink-0">
                        {doctor.fullname
                          ? doctor.fullname
                              .split(" ")
                              .filter(Boolean)
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                          : "DR"}
                      </div>
                      <div>
                        {isSuperAdmin && (
                          <p className="font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors text-sm">
                            {doctor.fullname || "Unknown Doctor"}
                          </p>
                        )}
                        <p className="text-[11px] text-gray-500">
                          ID: <span className="font-mono">{doctor.doctorId || "N/A"}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-800">
                      {doctor.specialty || "General"}
                    </span>
                  </td>

                  {isSuperAdmin && (
                    <>
                      <td className="px-3 py-2 text-xs text-gray-600 whitespace-nowrap">
                        {doctor.email || "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600 font-mono whitespace-nowrap">
                        {doctor.phone || "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600 whitespace-nowrap">
                        {formatDate(doctor.createdAt)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {getPasswordUpdateBadge(doctor.updatePassword)}
                      </td>
                    </>
                  )}

                  <td className="px-3 py-2 whitespace-nowrap">
                    {getStatusBadge(doctor.status)}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap text-right pr-4">
                    <div className="flex items-center justify-end space-x-0.5">
                      <button
                        onClick={() => handleEditDoctor(doctor)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Doctor"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        to={`/dashboard/doctor/${doctor._id}`}
                        className="p-1.5 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-200"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDoctors?.length === 0 && (
                <tr>
                  <td
                    colSpan={isSuperAdmin ? 8 : 4}
                    className="text-center py-8 text-gray-400 text-sm font-medium"
                  >
                    No doctors matching current criteria found.
                  </td>
                </tr>
              )}
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