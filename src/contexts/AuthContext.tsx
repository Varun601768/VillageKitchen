import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
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
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize demo user on first load
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (storedUsers.length === 0) {
      const demoUser = {
        id: 'demo-user-1',
        email: 'demo@smartpantry.com',
        password: 'demo123',
        name: 'Demo User',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('registeredUsers', JSON.stringify([demoUser]));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get stored users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get existing users
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if user already exists
    if (storedUsers.some((u: any) => u.email === email)) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In real app, this would be hashed
      name,
      createdAt: new Date().toISOString()
    };
    
    // Store user
    storedUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
    
    // Auto-login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};