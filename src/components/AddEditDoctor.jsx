import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AddEditDoctor = ({ isOpen, onClose, doctors, setDoctors, mode, initialData  }) => {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    status: "active",
  });

  // useEffect(() => {
  //   if (mode === "edit" && initialData) {
  //     setFormData(initialData);
  //   } else if (mode === "add") {
  //     setFormData({
  //       name: "",
  //       specialty: "",
  //       email: "",
  //       phone: "",
  //       status: "active",
  //     });
  //   }
  // }, [mode, initialData, isOpen]);

  // if (!isOpen) return null;

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = () => {
  //   if (!formData.name || !formData.specialty || !formData.email || !formData.phone) {
  //     alert("Please fill in all required fields");
  //     return;
  //   }
  //   onSubmit(formData);
  //   onClose();
  // };

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
    } else if (mode === "add") {
      setFormData({
        id: null,
        name: "",
        specialty: "",
        email: "",
        phone: "",
        status: "active",
      });
    }
  }, [mode, initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.specialty || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (mode === "add") {
      const newDoctor = {
        ...formData,
        id: Date.now(),
      };
      setDoctors([...doctors, newDoctor]);
      alert("Doctor added successfully!");
    } else if (mode === "edit") {
      const updatedDoctors = doctors.map(doctor => 
        doctor.id === formData.id ? formData : doctor
      );
      setDoctors(updatedDoctors);
      alert("Doctor updated successfully!");
    }
    
    onClose();
  };
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {mode === "add" ? "Add New Doctor" : "Edit Doctor"}
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specialty <span className="text-red-500">*</span>
            </label>
            <input
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="E.g. Cardiology"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="doctor@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="+233..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 font-semibold border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              {mode === "add" ? "Add Doctor" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditDoctor;