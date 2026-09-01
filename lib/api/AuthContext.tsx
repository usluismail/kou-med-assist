import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  fetchMe,
  getStoredToken,
  getStoredUser,
  login as apiLogin,
} from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { User, UserRole } from "@/lib/api/types";

type AuthState = {
  ready: boolean;
  token: string | null;
  user: User | null;
  login: (params: {
    email: string;
    password: string;
    role: UserRole;
  }) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          getStoredToken(),
          getStoredUser(),
        ]);
        if (cancelled) return;
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          try {
            const me = await fetchMe(storedToken);
            if (!cancelled) setUser(me);
          } catch {
            // offline / expired — stored user ile devam; 401’de temizle
          }
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (params: { email: string; password: string; role: UserRole }) => {
      const res = await apiLogin(params);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    await clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const me = await fetchMe(token);
      setUser(me);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        await logout();
      }
    }
  }, [token, logout]);

  const value = useMemo(
    () => ({ ready, token, user, login, logout, refreshUser }),
    [ready, token, user, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

// ─── ISP: Dar yüzey hook'ları ─────────────────────────────────────────────────
// Bileşenler ihtiyaçları olan slice'ı kullanır; tam AuthState'e maruz kalmaz.

/**
 * useUser — yalnızca mevcut kullanıcı nesnesine ihtiyaç duyan bileşenler için.
 * Örn: profil kartı, avatar, isim görüntüleme.
 */
export function useUser(): User | null {
  return useAuth().user;
}

/**
 * useToken — yalnızca API token'ına ihtiyaç duyan bileşenler için.
 * Örn: manuel fetch yapan bileşenler (ShiftsScreen vb.)
 */
export function useToken(): string | null {
  return useAuth().token;
}

/**
 * useIsReady — yalnızca auth hazırlık durumunu kontrol eden bileşenler için.
 * Örn: splash/boot screen göstergesi.
 */
export function useIsReady(): boolean {
  return useAuth().ready;
}
