import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");
  let user: any = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}