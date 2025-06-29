import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getToken } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jwt, setJwt] = useState(() => localStorage.getItem('sidebet_jwt'));

  useEffect(() => {
    const fetchUser = async () => {
      if (!jwt) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/me', { token: jwt });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
        localStorage.removeItem('sidebet_jwt');
        setJwt(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [jwt]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/login', { email, password });
      setUser(res.data.user);
      setJwt(res.data.token);
      localStorage.setItem('sidebet_jwt', res.data.token);
      return { success: true };
    } catch (err) {
      setUser(null);
      setJwt(null);
      localStorage.removeItem('sidebet_jwt');
      return { success: false, message: err.data?.message || 'Login failed' };
    }
  };

  const register = async (email, password, name) => {
    try {
      const res = await api.post('/register', { email, password, name });
      setUser(res.data.user);
      setJwt(res.data.token);
      localStorage.setItem('sidebet_jwt', res.data.token);
      return { success: true };
    } catch (err) {
      setUser(null);
      setJwt(null);
      localStorage.removeItem('sidebet_jwt');
      return { success: false, message: err.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setJwt(null);
    localStorage.removeItem('sidebet_jwt');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    jwt,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 
