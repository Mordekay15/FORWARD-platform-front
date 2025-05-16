import React, { createContext, useContext, useEffect, useState } from 'react';
import Loading from '../components/Loading';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let logoutTimer;

    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    const storedExpiry = localStorage.getItem('authExpiry');

    const now = Date.now();

    if (storedToken && storedUser && storedExpiry && now < Number(storedExpiry)) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      const remainingTime = Number(storedExpiry) - now;
      logoutTimer = setTimeout(() => {
        logout();
      }, remainingTime);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('authExpiry');
    }

    setLoading(false);

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);

  const login = (resData) => {
    const { token, user } = resData;

    const expirationTime = Date.now() + 1000 * 60 * 60 * 2; 

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authExpiry', expirationTime);

    setToken(token);
    setUser(user);

    const remainingTime = expirationTime - Date.now();
    setTimeout(() => {
      logout();
    }, remainingTime);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('authExpiry');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
