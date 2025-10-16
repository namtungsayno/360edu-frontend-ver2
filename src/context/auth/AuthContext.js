import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { authService } from "services/auth/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInit] = useState(true);

  useEffect(() => {
    let ok = true;
    (async () => {
      const { user: u } = await authService.restoreSession();
      if (ok) { setUser(u); setInit(false); }
    })();
    return () => { ok = false; };
  }, []);

  const login = useCallback(async (cred) => {
    const { user: u } = await authService.login(cred);
    setUser(u); return u;
  }, []);
  const logout = useCallback(async () => { await authService.logout(); setUser(null); }, []);
  const refreshProfile = useCallback(async () => { const u = await authService.getProfile(); setUser(u); return u; }, []);

  const value = useMemo(() => ({
    user, initializing, isAuthenticated: !!user, login, logout, refreshProfile,
  }), [user, initializing, login, logout, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
