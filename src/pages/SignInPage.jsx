import React, { useState } from 'react';
import { Activity, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../redux/AuthSlice';
import toast from '../components/Toast';
import logo from '../assets/isplogonormal.svg';


const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState('')





  const handleLogin = () => {
    setErrorMessage("");
    setSuccessMessage("");
    dispatch(adminLogin({ email, password }))
      .unwrap()
      .then(() => {
        setSuccessMessage("Login successful ✅");
        navigate("/dashboard");
        toast.success("Login successful ✅")


      })
      .catch((err) => {
        if (typeof err === "string") {
          setErrorMessage(err);
        } else if (err?.message) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-white flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="w-full max-w-md relative z-10">


        {/* Sign In Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div>
                <img
                  src={logo}
                  alt="ISOLP Logo"
                  className='h-20 w-20'
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome </h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          {successMessage && (
            <div className="mt-4">
              <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
                {successMessage}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4">
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold">
                {errorMessage}
              </div>
            </div>
          )}
          {/* Sign In Form */}
          <div className="space-y-6 pt-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100 outline-none transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
                  Remember me
                </span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition"
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign In Button */}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-600/50 transition transform hover:-translate-y-0.5 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>




        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Protected by industry-leading security standards</p>
          {/* <div className="flex justify-center items-center space-x-4 mt-2">
            <span className="flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>HIPAA Compliant</span>
            </span>
            <span>•</span>
            <span>256-bit Encryption</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;