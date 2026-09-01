import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, setToken, clearToken } from "./storage";
import { loginUser, registerUser } from "./api";

type Role = "admin" | "staff" | "user";

export type User = {
  id: number;
  email: string;
  role: Role;
  first_name?: string;
  last_name?: string;
  profile_completed?: boolean;
  phone?: string;
  dob?: string;
  passport_no?: string;
  license_no?: string;
  country?: string;
  address_line1?: string;
  city?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthed: boolean;
  loginWithPassword: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthed: false,
  loginWithPassword: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: () => {},
});

function decodeJwt(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: Number(payload.id),
      email: String(payload.email),
      role: (payload.role ?? "user") as Role,
      first_name: payload.first_name,
      last_name: payload.last_name,
      profile_completed: payload.profile_completed,
      phone: payload.phone,
      dob: payload.dob,
      passport_no: payload.passport_no,
      license_no: payload.license_no,
      country: payload.country,
      address_line1: payload.address_line1,
      city: payload.city,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const u = decodeJwt(token);
    if (!u) {
      clearToken();
      setUser(null);
      return;
    }
    setUser(u);
  }, []);

  const loginWithPassword = async (email: string, password: string) => {
    const res = await loginUser({ email, password });
    if (!res?.token) throw new Error("Login failed: token missing");
    setToken(res.token);
    const u = decodeJwt(res.token);
    if (!u) {
      clearToken();
      throw new Error("Login failed: invalid token");
    }
    setUser(u);
  };

  const register = async (email: string, password: string) => {
    const res = await registerUser({ email, password });
    if (!res?.token) throw new Error("Register failed: token missing");
    setToken(res.token);
    const u = decodeJwt(res.token);
    if (!u) {
      clearToken();
      throw new Error("Register failed: invalid token");
    }
    setUser(u);
  };

  const logout = () => {
    clearToken();
    setUser(null);
    window.location.href = "/login";
  };

  const refreshUser = () => {
    const token = getToken();
    if (!token) return;
    const u = decodeJwt(token);
    setUser(u);
  };

  const value = useMemo(
    () => ({ user, isAuthed: !!user, loginWithPassword, register, logout, refreshUser }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
