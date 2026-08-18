import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../../../api/apiservice';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      // Adjust based on your actual API response structure (e.g. response.data.user)
      const userData = response.data?.user || response.data || response;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch to check if session exists
    fetchUser();

    // Listen to unauthorized events triggered by apiservice interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('api:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('api:unauthorized', handleUnauthorized);
    };
  }, [fetchUser]);

  const login = async (identifier, password, remember) => {
    // This will throw if login fails, to be caught by the component
    const response = await authApi.login(identifier, password, remember);
    // After login, fetch the user profile to populate state
    await fetchUser();
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API failed, but continuing local cleanup.", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, checkAuth: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
