import { createContext, useContext, useState, useEffect } from 'react';
import Loading from '../components/Loading';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    

    setLoading(false);
  }, []);

  const login = (resData) => {
    const { token, user } = resData;

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); 
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return <Loading/>;
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
