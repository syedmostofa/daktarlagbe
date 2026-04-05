import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { Stethoscope, LogOut, Menu, X, Bell, User, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-teal-600 font-extrabold text-xl tracking-tight">
          <div className="bg-teal-600 text-white rounded-lg p-1.5">
            <Stethoscope size={18} />
          </div>
          <span>daktarlagbe</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          <Link to="/doctors" className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium">
            Find Doctors
          </Link>
          {user ? (
            <>
              {user.role === 'doctor' && (
                <Link to="/doctor/dashboard" className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium">
                  Dashboard
                </Link>
              )}
              {user.role === 'patient' && (
                <Link to="/my-appointments" className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium">
                  My Appointments
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium flex items-center gap-1">
                  <Shield size={14} /> Admin
                </Link>
              )}

              {/* Notifications */}
              <Link to="/notifications" className="relative text-gray-400 hover:text-teal-600 transition-colors p-1">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link to="/profile" className="text-gray-400 hover:text-teal-600 transition-colors p-1">
                <User size={20} />
              </Link>

              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <span className="text-sm text-gray-500 font-medium">Hi, {user.name?.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors font-medium"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-500 hover:text-gray-700 p-1" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4">
          <Link to="/doctors" className="text-gray-700 text-sm font-medium" onClick={() => setMenuOpen(false)}>Find Doctors</Link>
          {user ? (
            <>
              {user.role === 'doctor' && (
                <Link to="/doctor/dashboard" className="text-gray-700 text-sm font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              )}
              {user.role === 'patient' && (
                <Link to="/my-appointments" className="text-gray-700 text-sm font-medium" onClick={() => setMenuOpen(false)}>My Appointments</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 text-sm font-medium" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <Link to="/notifications" className="text-gray-700 text-sm font-medium flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                Notifications
                {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{unreadCount}</span>}
              </Link>
              <Link to="/profile" className="text-gray-700 text-sm font-medium" onClick={() => setMenuOpen(false)}>Profile</Link>
              <div className="pt-2 border-t border-gray-100">
                <button onClick={handleLogout} className="text-left text-red-500 text-sm font-medium">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 text-sm font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold inline-block text-center" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
