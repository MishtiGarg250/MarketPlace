import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";

function getAuthUser() {
  if (typeof window === "undefined") return null;
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (!auth || !auth.user) return null;
    return auth.user;
  } catch {
    return null;
  }
}

export function AdminRoute({ children }: { children: ReactElement }) {
  const user = getAuthUser();
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function SellerRoute({ children }: { children: ReactElement }) {
  const user = getAuthUser();
  if (!user || user.role !== "seller") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function BuyerRoute({ children }: { children: ReactElement }) {
  const user = getAuthUser();
  if (!user || user.role !== "buyer") {
    return <Navigate to="/login" replace />;
  }
  return children;
}
