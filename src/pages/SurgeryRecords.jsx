import React, { useState } from "react";
import {
  Search,
  Download,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { exportToCSV } from "../utils/Helper";

const AdminSurgeryRecords = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // ⛔️ CHANGE THIS TO MATCH YOUR SLICE NAME
  // Example: state.surgeryRecords.records
  const  surgeryRecords = useSelector((state) => state.surgeries.list);

  // 📌 CSV Export
  const handleExport = () => {
    exportToCSV(surgeryRecords, "all_surgery_records.csv");
  };
  // 🔍 Searching + filtering
  const filteredRecords = surgeryRecords
    ?.filter((r) => {
      const term = searchTerm.toLowerCase();
      return (
        r.id.toLowerCase().includes(term) ||
        r.patientName.toLowerCase().includes(term) ||
        r.procedure.toLowerCase().includes(term)
      );
    })
    .filter((r) =>
      filterStatus === "all"
        ? true
        : r.status.toLowerCase() === filterStatus.toLowerCase()
    );

  const statusColors = {
    completed: "bg-green-100 text-green-700",
    "in progress": "bg-blue-100 text-blue-700",
    scheduled: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Surgery Records</h1>
          <p className="text-gray-600 mt-1">Admin overview of all procedures</p>
        </div>

        <button
          onClick={handleExport}
          className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 border bg-white hover:bg-gray-50 rounded-lg transition font-semibold"
        >
          <Download className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, initials, or procedure"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-cyan-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in progress">In Progress</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Record ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Patient
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Procedure
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Doctor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredRecords?.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-cyan-600">{r.id}</td>

                  <td className="px-6 py-4">
                    <p className="font-semibold">{r.patientName}</p>
                    <p className="text-sm text-gray-500">{r.patientAge} yrs</p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium">{r.procedure}</p>
                    <p className="text-sm text-gray-500">{r.duration}</p>
                  </td>

                  <td className="px-6 py-4">{r.doctor}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <Calendar className="w-4 text-gray-400" />
                      <span>{r.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                      <Clock className="w-4 text-gray-400" />
                      <span>{r.time}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        statusColors[r.status.toLowerCase()]
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`${r.id}`)}
                      className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRecords?.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSurgeryRecords;
