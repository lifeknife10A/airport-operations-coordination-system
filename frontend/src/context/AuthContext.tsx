import React, { createContext, useContext, useState } from 'react';
import { User, LoginResponse } from '../types';
import { authApi } from '../api/authApi';

export interface AuthorizedAccount {
  userId: number;
  username: string;
  email: string;
  dbUsername: string;
  name: string;
  roleId: number;
  roleName: string;
  departmentId: number;
  departmentName: string;
  dashboardPath: string;
}

export const AUTHORIZED_ACCOUNTS: AuthorizedAccount[] = [
  {
    userId: 10,
    username: 'admin',
    email: 'admin@saphire.in',
    dbUsername: 'user_10_aarav',
    name: 'Aarav Li',
    roleId: 10,
    roleName: 'SYSTEM_ADMINISTRATOR',
    departmentId: 10,
    departmentName: 'TERMINAL_MANAGEMENT',
    dashboardPath: '/dashboard/system-admin',
  },
  {
    userId: 1,
    username: 'aocc',
    email: 'aocc@saphire.in',
    dbUsername: 'user_1_sai',
    name: 'Sai Sharma',
    roleId: 1,
    roleName: 'AIRPORT_OPERATIONS_MANAGER',
    departmentId: 1,
    departmentName: 'FLIGHT_OPERATIONS',
    dashboardPath: '/dashboard/aocc',
  },
  {
    userId: 2,
    username: 'ground',
    email: 'ground@saphire.in',
    dbUsername: 'user_2_riya',
    name: 'Riya Johnson',
    roleId: 2,
    roleName: 'GROUND_HANDLING_SUPERVISOR',
    departmentId: 2,
    departmentName: 'GROUND_HANDLING',
    dashboardPath: '/dashboard/ground-ops',
  },
  {
    userId: 9,
    username: 'department',
    email: 'department@saphire.in',
    dbUsername: 'user_9_elena',
    name: 'Elena Tanaka',
    roleId: 9,
    roleName: 'AIRLINE_BILLING_CLERK',
    departmentId: 8,
    departmentName: 'AIRLINE_FINANCE_BILLING',
    dashboardPath: '/dashboard/department',
  },
  {
    userId: 5,
    username: 'airside',
    email: 'airside@saphire.in',
    dbUsername: 'user_5_aditya',
    name: 'Aditya Zhang',
    roleId: 5,
    roleName: 'GATE_AGENT',
    departmentId: 7,
    departmentName: 'AIRFIELD_MAINTENANCE',
    dashboardPath: '/dashboard/airside-ops',
  },
  {
    userId: 3,
    username: 'logistics',
    email: 'logistics@saphire.in',
    dbUsername: 'user_3_priya',
    name: 'Priya Kumar',
    roleId: 4,
    roleName: 'BAGGAGE_HANDLER',
    departmentId: 3,
    departmentName: 'BAGGAGE_SERVICES',
    dashboardPath: '/dashboard/logistics',
  },
  {
    userId: 7,
    username: 'passenger',
    email: 'passenger@saphire.in',
    dbUsername: 'user_7_aarav',
    name: 'Aarav Patel',
    roleId: 7,
    roleName: 'SECURITY_OFFICER',
    departmentId: 5,
    departmentName: 'SECURITY_AND_SAFETY',
    dashboardPath: '/dashboard/passenger-security',
  },
];

const VALID_PASSWORDS = ['SaphireOps@2026', 'pass', 'admin123'];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, passkey: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('aocs_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (identifier: string, passkey: string): Promise<User> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = passkey.trim();

    try {
      // 1. Attempt Spring Boot backend authentication
      const data: LoginResponse = await authApi.login(cleanId, cleanPass);
      const userData: User = {
        userId: data.userId,
        username: data.username,
        name: data.name,
        roleId: data.roleId,
        roleName: data.roleName,
        departmentId: data.departmentId,
        departmentName: data.departmentName,
        token: data.token,
      };
      localStorage.setItem('aocs_token', data.token);
      localStorage.setItem('aocs_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error: any) {
      // If backend responded with 401/400/403, it explicitly rejected the credentials!
      if (error.response && (error.response.status === 401 || error.response.status === 400 || error.response.status === 403)) {
        const errorMsg = error.response.data?.message || 'Invalid operational credentials. Access denied.';
        throw new Error(errorMsg);
      }

      // If backend is offline, validate against authoritative Saphire accounts
      const matched = AUTHORIZED_ACCOUNTS.find(
        (acc) =>
          acc.email.toLowerCase() === cleanId ||
          acc.username.toLowerCase() === cleanId ||
          acc.dbUsername.toLowerCase() === cleanId
      );

      if (!matched) {
        throw new Error('Unrecognized operational identifier. Access denied.');
      }

      if (!VALID_PASSWORDS.includes(cleanPass)) {
        throw new Error('Invalid security passkey. Access denied.');
      }

      const userData: User = {
        userId: matched.userId,
        username: matched.username,
        name: matched.name,
        roleId: matched.roleId,
        roleName: matched.roleName,
        departmentId: matched.departmentId,
        departmentName: matched.departmentName,
        token: `saphire-jwt-${matched.roleName.toLowerCase()}-${Date.now()}`,
      };

      localStorage.setItem('aocs_token', userData.token!);
      localStorage.setItem('aocs_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
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
