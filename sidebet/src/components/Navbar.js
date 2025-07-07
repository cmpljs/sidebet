import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UI_CONFIG } from '../config/uiConfig';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center h-16 w-full">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-blue-300">
              {UI_CONFIG.LOGO_TEXT}
            </Link>
            
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/dashboard" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {UI_CONFIG.DASHBOARD_TEXT}
                </Link>
                <Link 
                  to="/leaderboards" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {UI_CONFIG.LEADERBOARDS_TEXT}
                </Link>
                <Link 
                  to="/create-bet" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <span className="text-lg font-bold">+</span>
                  <span>{UI_CONFIG.CREATE_BET_TEXT}</span>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-blue-400 text-md font-medium">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
