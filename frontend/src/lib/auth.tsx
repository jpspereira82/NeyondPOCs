import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Role = "MEMBER" | "ADMIN";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
  department: string;
  points: number;
}

interface AuthContextValue {
  user: MockUser | null;
  login: (email: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "vybe.mockUser";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = (email: string, role: Role) => {
    const isAdmin = role === "ADMIN";
    const mocked: MockUser = {
      id: isAdmin ? "u-admin" : "u-current",
      name: isAdmin ? "Sofia Carvalho" : "Alex Pereira",
      email,
      role,
      avatarColor: isAdmin ? "bg-rose-500" : "bg-brand-600",
      department: isAdmin ? "People Ops" : "Engineering",
      points: isAdmin ? 0 : 340
    };
    setUser(mocked);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}