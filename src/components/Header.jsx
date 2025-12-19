import React, { useState } from 'react';
import {
  Search,
  Bell,
  Mail,
  ChevronDown,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Shield,
  Users,
  Activity,
  Database
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import toast from './Toast';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading ,admin} = useSelector((state) => state.auth)

  const notifications = [
    { id: 1, text: 'New doctor registration pending approval', time: '5 min ago', unread: true, type: 'warning' },
    { id: 2, text: '15 new surgery records added today', time: '30 min ago', unread: true, type: 'info' },
    { id: 3, text: 'System backup completed successfully', time: '1 hour ago', unread: false, type: 'success' },
    { id: 4, text: 'Database maintenance scheduled for tomorrow', time: '2 hours ago', unread: false, type: 'info' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const quickStats = [
    { label: 'Active Doctors', value: '156', icon: Users, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
    { label: 'Today\'s Surgeries', value: '23', icon: Activity, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'System Status', value: 'Online', icon: Database, color: 'text-green-600', bgColor: 'bg-green-100' },
  ];



  const handleLogout = (e) => {
    e.preventDefault();

    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        setShowProfileMenu(false);
        navigate('/');
        toast.success('Logged out successfully!');
      });
  };
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors, records, patients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div> */}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6 ml-6">
          {/* Quick Stats */}
          {/* <div className="hidden xl:flex items-center space-x-4">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div> */}

          {/* Divider */}


          {/* Divider */}
          <div className="h-8 w-px bg-gray-300"></div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{admin?.role}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      AD
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500">{admin?.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Shield className="w-3 h-3 text-purple-600" />
                        <span className="text-xs text-purple-600 font-semibold">System Administrator</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Admin Profile</span>
                  </Link>
                </div>

                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className={`flex items-center space-x-3 px-4 py-3 w-full transition text-left
      ${loading ? 'cursor-not-allowed opacity-70' : 'hover:bg-red-50'}`}
                  >
                    {loading ? (
                      <>
                        {/* Spinner */}
                        <svg
                          className="w-4 h-4 animate-spin text-red-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>

                        <span className="text-sm text-red-600 font-medium">
                          Logging out...
                        </span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600 font-medium">Logout</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;