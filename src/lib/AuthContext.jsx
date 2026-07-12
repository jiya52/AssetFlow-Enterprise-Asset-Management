import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    const token = localStorage.getItem('assetflow_token');
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
      return;
    }

    try {
      setIsLoadingAuth(true);
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const currentUser = await res.json();
        setUser(currentUser);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        localStorage.removeItem('assetflow_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('User auth check failed:', error);
      // Don't clear token on network error to allow offline access
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('assetflow_token', data.token);
        setUser(data);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const errData = await res.json();
        setAuthError({ message: errData.message || 'Invalid credentials' });
        return { success: false, message: errData.message || 'Invalid credentials' };
      }
    } catch (err) {
      setAuthError({ message: 'Server unreachable. Please try again.' });
      return { success: false, message: 'Server unreachable. Please try again.' };
    }
  };

  const signup = async (signupData) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      if (res.ok) {
        return { success: true };
      } else {
        const errData = await res.json();
        return { success: false, message: errData.error || 'Signup failed' };
      }
    } catch (err) {
      return { success: false, message: 'Server unreachable. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('assetflow_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('assetflow_token');
    if (!token) return { success: false, message: 'No authentication token found' };

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      } else {
        const errData = await res.json();
        return { success: false, message: errData.message || 'Profile update failed' };
      }
    } catch (err) {
      return { success: false, message: 'Server unreachable. Please try again.' };
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/auth/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      authChecked,
      logout,
      navigateToLogin,
      login,
      signup,
      checkUserAuth,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
