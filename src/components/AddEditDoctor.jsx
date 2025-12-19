import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addDoctor, updateDoctor } from "../redux/DoctorSlice";
import toast from "./Toast";


const AddEditDoctor = ({ isOpen, onClose, mode, initialData }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    specialty: "",
    email: "",
    phone: "",
    country: '',
    city: '',
    status: "active",
  });


  const [countries, setCountries] = useState([]);


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const data = await res.json();

        const countryNames = data
          .map((country) => country.name.common)
          .sort((a, b) => a.localeCompare(b));

        setCountries(countryNames);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

    fetchCountries();
  }, []);


  const dispatch = useDispatch();

  const { updateLoading, error } = useSelector((state) => state.doctor);


  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
    } else if (mode === "add") {
      setFormData({
        id: null,
        fullname: "",
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

  const handleSubmit = async () => {
    if (
      !formData.fullname ||
      !formData.specialty ||
      !formData.email ||
      !formData.phone ||
      !formData.country ||
      !formData.city
    ) {
      return;
    }

    try {
      if (mode === "add") {
        await dispatch(addDoctor(formData)).unwrap();
        toast.success("Doctor added successfully ✅")
      } else {
        await dispatch(
          updateDoctor({
            id: initialData._id,
            data: formData,
          })
        ).unwrap();
        toast.success("Doctor updated successfully ✅")

      }
      onClose()

    } catch (err) {
      console.error(err);
      toast.error(err || 'Failed to update')
    }
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
          {mode === 'edit' ? <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Doctor ID <span className="text-red-500">*</span>
            </label>
            <input
              disabled
              value={formData.doctorId}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="Enter full name"
            />
          </div>
            :
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fullname <span className="text-red-500">*</span>
              </label>
              <input
                name="fullname"
                onChange={handleChange}
                value={formData.fullname}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                placeholder="Enter full name"
              />
            </div>}

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
              Country <span className="text-red-500">*</span>
            </label>

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              required
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="Accra"
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
              disabled={updateLoading}
              onClick={handleSubmit}
              className={`flex-1 px-4 py-2.5 font-semibold rounded-lg transition transform
    ${updateLoading
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:-translate-y-0.5"
                }`}
            >
              {updateLoading
                ? "Saving..."
                : mode === "add"
                  ? "Add Doctor"
                  : "Save Changes"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditDoctor;