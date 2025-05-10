import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Mock data for demo
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@example.com',
    role: 'manager'
  },
  {
    id: '3',
    username: 'employee',
    email: 'employee@example.com',
    role: 'employee'
  }
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get('http://localhost:5000/api/auth/status', { timeout: 2000 });
        setBackendAvailable(true);
      } catch (error) {
        console.log('Backend not available, using mock data');
        setBackendAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  // Check for existing login
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Only try to verify with backend if it's available
        if (backendAvailable) {
          axios.get('http://localhost:5000/api/auth/me')
            .catch(() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              delete axios.defaults.headers.common['Authorization'];
              setUser(null);
            });
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, [backendAvailable]);

  const login = async (email, password) => {
    if (backendAvailable) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password
        });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return user;
      } catch (error) {
        throw error;
      }
    } else {
      // Mock login for demo
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const mockUser = MOCK_USERS.find(u => u.email === email);
          
          if (mockUser && password === 'password') {
            const token = 'mock-jwt-token';
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(mockUser));
            setUser(mockUser);
            resolve(mockUser);
          } else {
            reject({ response: { data: { message: 'Invalid credentials' } } });
          }
        }, 500);
      });
    }
  };

  const register = async (userData) => {
    if (backendAvailable) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', userData);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return user;
      } catch (error) {
        throw error;
      }
    } else {
      // Mock registration for demo
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check if user already exists
          const userExists = MOCK_USERS.some(
            u => u.email === userData.email || u.username === userData.username
          );
          
          if (userExists) {
            reject({ response: { data: { message: 'User already exists' } } });
            return;
          }
          
          // Create new mock user
          const newUser = {
            id: String(MOCK_USERS.length + 1),
            username: userData.username,
            email: userData.email,
            role: userData.role || 'employee'
          };
          
          // Add to mock users
          MOCK_USERS.push(newUser);
          
          const token = 'mock-jwt-token';
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(newUser));
          setUser(newUser);
          resolve(newUser);
        }, 500);
      });
    }
  };

  const updateUser = (updatedUserData) => {
    if (backendAvailable) {
      // Update local state with new user data
      setUser(updatedUserData);
      // Update local storage
      localStorage.setItem('user', JSON.stringify(updatedUserData));
    } else {
      // Mock update for demo
      // Find and update the user in mock data
      const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        MOCK_USERS[userIndex] = {
          ...MOCK_USERS[userIndex],
          username: updatedUserData.username,
          email: updatedUserData.email
        };
        
        // Update user state and localStorage
        setUser({
          ...user,
          username: updatedUserData.username,
          email: updatedUserData.email
        });
        
        localStorage.setItem('user', JSON.stringify({
          ...user,
          username: updatedUserData.username,
          email: updatedUserData.email
        }));
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout,
      updateUser,
      loading,
      backendAvailable 
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