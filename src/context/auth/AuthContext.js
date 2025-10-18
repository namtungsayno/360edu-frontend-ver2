// src/context/auth/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { authService } from "services/auth/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInit] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { user: u } = await authService.restoreSession();
      if (mounted) {
        setUser(u);
        setInit(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (cred) => {
    const { user: u } = await authService.login(cred);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const u = await authService.getProfile();
    setUser(u);
    return u;
  }, []);

  const hasAnyRole = useCallback(
    (roles = []) => {
      if (!user?.roles || roles.length === 0) return true;
      return user.roles.some((r) => roles.includes(r));
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: !!user,
      login,
      logout,
      refreshProfile,
      hasAnyRole,
    }),
    [user, initializing, login, logout, refreshProfile, hasAnyRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
