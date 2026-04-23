import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/authApi';
import { tokenStorage } from '../utils/tokenStorage';
import { ROLES, Role } from '../constants/roles';

interface AuthUser { id: string; name: string; email?: string; phone?: string; role: Role }

interface AuthContextValue {
  user: AuthUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (creds: { email?: string; phone?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokenStorage.hasTokens()) { setLoading(false); return; }
    authApi.me()
      .then(({ data }) => setUser(data))
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (creds: { email?: string; phone?: string; password: string }) => {
    const { data } = await authApi.login(creds);
    tokenStorage.setTokens(data.access_token, data.refresh_token);
    const me = await authApi.me();
    setUser(me.data);
  };

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    tokenStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, role: user?.role ?? null,
      isAuthenticated: !!user, loading, login, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
};
