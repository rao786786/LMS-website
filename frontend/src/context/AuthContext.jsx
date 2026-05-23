import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('lms_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (userData) {
      localStorage.setItem('lms_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('lms_user');
    }
  }, [userData]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUserData(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    setUserData(data);
    return data;
  };

  const logout = () => setUserData(null);

  const value = {
    user: userData?.user || null,
    token: userData?.token || null,
    login,
    register,
    logout,
    isLoggedIn: !!userData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
