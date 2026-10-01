import React, { createContext, useContext, useState } from 'react';
import { User, LoginResponse } from '../types';
import { authApi } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, passkey: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('aocs_user');
      return savedUser ? (JSON.parse(savedUser) as User) : null;
    } catch {
      // Corrupted value (hand-edited or from an older build): treat as signed out, don't crash.
      localStorage.removeItem('aocs_user');
      localStorage.removeItem('aocs_token');
      return null;
    }
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
      // 429 = the backend has temporarily locked this account/IP after repeated failed logins. It
      // must be treated as a rejection, not as "backend offline", or the demo fallback below would
      // let the lockout be sidestepped in the UI. The backend's ProblemDetail carries its text in
      // `detail` (older responses used `message`).
      if (error.response && [400, 401, 403, 429].includes(error.response.status)) {
        const errorMsg =
          error.response.data?.detail ||
          error.response.data?.message ||
          'Invalid operational credentials. Access denied.';
        throw new Error(errorMsg);
      }

      // No offline/demo login: any other failure (network error, timeout, 5xx) means the backend
      // is unavailable, and signing in without it would mean trusting hard-coded passwords.
      throw new Error('Cannot reach the AOCS server right now. Please try again shortly.');
    }
  };

  const logout = async () => {
    // Revoke the session server-side (the auth_sessions row behind this token) before clearing
    // the token locally -- otherwise there'd be no Authorization header left to identify which
    // session to revoke. Best-effort: if the backend is unreachable this call can't revoke
    // anything and is safe to ignore, but the local session must still end either way.
    try {
      await authApi.logout();
    } catch {
      // Backend unreachable or token already invalid -- local logout still proceeds below.
    }
    localStorage.removeItem('aocs_token');
    localStorage.removeItem('aocs_user');
    // Per-browser working data (cached flights, tasks, audit trail, ...) belongs to whoever was
    // signed in; clear it so the next person on this browser doesn't see it.
    Object.keys(localStorage)
      .filter((k) => k.startsWith('saphire_') && k !== 'saphire_sidebar_open')
      .forEach((k) => localStorage.removeItem(k));
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
