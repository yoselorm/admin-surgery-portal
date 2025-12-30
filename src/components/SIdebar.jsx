import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Hospital,
  BarChart3,
  Settings,
  Shield,
  Activity,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Database,
  Bell
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/AuthSlice';
import toast from './Toast';
import wlogo from '../assets/isplogowhite.svg'

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Manage Doctors', path: '/dashboard/manage-doctors' },
    { icon: FileText, label: 'Surgery Records', path: '/dashboard/records' },
    // { icon: Hospital, label: 'Departments', path: '/admin/departments' },
    // { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    // { icon: Database, label: 'Database', path: '/admin/database' },
    // { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    // { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/');
        toast.success('Logged out successfully!');
      });
  };
  return (
    <div
      className={`${collapsed ? 'w-20' : 'w-64'
        } bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 flex flex-col h-screen relative border-r border-gray-700`}
    >
      {/* Logo Section */}
      <div className="p-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div>
            <img
              src={wlogo}
              className='h-16 w-16'
            />
          </div>
          {!collapsed && (
            <div>
              <span className="text-xl font-bold">SurgSuite</span>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-gray-800 text-white rounded-full p-1 shadow-lg hover:bg-gray-700 transition z-10 border border-gray-600"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition group ${active
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
              {!collapsed && (
                <span className={`font-medium ${active ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Profile Section */}
      <div className="p-4 border-t border-gray-700">
        {!collapsed ? (
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center font-bold">
              AD
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Admin User</p>
              <p className="text-xs text-gray-400">System Administrator</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition">
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="text-sm font-medium">{loading ? "Logging out..." : "Logout"}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;