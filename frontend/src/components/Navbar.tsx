import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          UniMaintain
        </Link>

        <div className="flex items-center gap-6">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium">
                  Dashboard
                </Link>

                {(user.role === 'ADMIN' || user.role === 'OFFICER') && (
                  <Link to="/requests" className="text-slate-600 hover:text-slate-900 font-medium">
                    Requests
                  </Link>
                )}

                {user.role === 'ADMIN' && (
                  <Link to="/admin/users" className="text-slate-600 hover:text-slate-900 font-medium">
                    Users
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
                <span className="text-sm">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-slate-500 ml-2">({user.role.toLowerCase()})</span>
                </span>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
