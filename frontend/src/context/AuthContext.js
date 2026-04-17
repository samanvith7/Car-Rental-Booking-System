import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const { data } = await api.get('/auth/me');
      setUser(data.data);
    } catch {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { token, ...userData } = data.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    const { token, ...userData } = data.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const toggleWishlist = async (carId) => {
    try {
      const { data } = await api.put(`/users/wishlist/${carId}`);
      setUser(prev => ({ ...prev, wishlist: data.wishlist }));
      toast.success(data.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist');
      return data.action;
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = (carId) => {
    if (!user?.wishlist) return false;
    return user.wishlist.some(id => (id._id || id) === carId);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateUser, toggleWishlist, isInWishlist,
      isAdmin: user?.role === 'admin', isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
