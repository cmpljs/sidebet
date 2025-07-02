import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BetProvider } from './contexts/BetContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateBet from './components/CreateBet';
import AcceptBet from './components/AcceptBet';
import Leaderboards from './components/Leaderboards';
import './index.css';


const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};


const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <BetProvider>
        <Router>
          <div className="min-h-screen bg-dark-blue text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-12">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create-bet" 
                  element={
                    <ProtectedRoute>
                      <CreateBet />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/accept-bet/:betId" 
                  element={<AcceptBet />} 
                />
                <Route 
                  path="/leaderboards" 
                  element={
                    <ProtectedRoute>
                      <Leaderboards />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </BetProvider>
    </AuthProvider>
  );
}

export default App; 
