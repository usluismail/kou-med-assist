import type { ReactNode } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/lib/api/AuthContext";
import type { UserRole } from "@/lib/api/types";
import { BootScreen } from "@/components/med/BootScreen";

export function RequireRole({
  role,
  children,
}: {
  role: UserRole;
  children: ReactNode;
}) {
  const { ready, token, user } = useAuth();
  if (!ready) return <BootScreen />;
  if (!token || user?.role !== role) return <Redirect href="/" />;
  return <>{children}</>;
}
