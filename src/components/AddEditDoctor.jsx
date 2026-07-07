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
          "https://countriesnow.space/api/v0.1/countries"
        );
        const data = await res.json();

        const countryNames = data?.data
          .map((country) => country.country)
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
        country: "",
        city: "",
        status: "active",
      });
    }
  }, [mode, initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Only fullname is required now — everything else is optional.
    if (!formData.fullname.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-backdrop"
      onClick={handleBackdropClick}
    >
      <style>{`
        @keyframes modalBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalPopIn {
          0% { opacity: 0; transform: scale(0.94) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-backdrop {
          animation: modalBackdropFade 0.2s ease-out;
        }
        .modal-panel {
          animation: modalPopIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
      <div
        className="modal-panel bg-white w-full max-w-lg rounded-2xl shadow-2xl ring-1 ring-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-6 py-5 flex justify-between items-center border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === "add" ? "Add New Doctor" : "Edit Doctor"}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Only full name is required
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1.5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto bg-white">
          {mode === 'edit' ? <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Doctor ID
            </label>
            <input
              disabled
              value={formData.doctorId}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-gray-500 outline-none"
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
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                placeholder="Enter full name"
              />
            </div>}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specialty
            </label>
            <input
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
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
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="doctor@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="+233..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Country
            </label>

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
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
              City
            </label>
            <input
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              placeholder="Accra"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 font-semibold border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={updateLoading}
              onClick={handleSubmit}
              className={`flex-1 px-4 py-2.5 font-semibold rounded-lg transition transform
    ${updateLoading
                  ? "bg-cyan-600 text-white cursor-not-allowed opacity-80"
                  : "bg-cyan-600 text-white hover:bg-cyan-700 hover:shadow-lg hover:-translate-y-0.5"
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