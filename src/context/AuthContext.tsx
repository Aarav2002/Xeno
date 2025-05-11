import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('crm_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      localStorage.setItem('crm_user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response format from server');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('crm_user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Successfully registered!');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register';
      toast.error(errorMessage);
      throw error;
    }
  };

  const googleLogin = (credential: string) => {
    try {
      const decoded: any = jwtDecode(credential);
      
      const user = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      };
      
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('crm_user', JSON.stringify(user));
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('crm_user');
    toast.success('Successfully logged out!');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};