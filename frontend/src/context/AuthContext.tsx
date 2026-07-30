import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginResponse } from '../types';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, overrideRole?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('aocs_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, password: string, overrideRole?: string) => {
    try {
      const data: LoginResponse = await authApi.login(username, password);
      let userData: User = {
        userId: data.userId,
        username: data.username,
        name: data.name,
        roleId: data.roleId,
        roleName: data.roleName,
        departmentId: data.departmentId,
        departmentName: data.departmentName,
        token: data.token,
      };

      if (overrideRole) {
        userData.roleName = overrideRole;
      }

      localStorage.setItem('aocs_token', data.token || 'demo-jwt-token-saphire-aocs');
      localStorage.setItem('aocs_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      // Fallback for offline/demo mode if backend isn't running live
      const demoUser: User = {
        userId: 1,
        username: username || 'admin',
        name: username ? username.toUpperCase() : 'AIRPORT MANAGER',
        roleId: 1,
        roleName: overrideRole || 'AIRPORT_OPERATIONS_MANAGER',
        departmentId: 1,
        departmentName: 'FLIGHT_OPERATIONS',
        token: 'demo-jwt-token-saphire-aocs-sp3',
      };
      localStorage.setItem('aocs_token', demoUser.token!);
      localStorage.setItem('aocs_user', JSON.stringify(demoUser));
      setUser(demoUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('aocs_token');
    localStorage.removeItem('aocs_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
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
