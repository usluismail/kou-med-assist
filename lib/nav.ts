import type { Href } from "expo-router";
import type { StudentUser, User } from "./api/types";

export type StudentArea = "pre-klinik" | "klinik" | "intorn";

export function studentArea(period?: number | null): StudentArea {
  if (period != null && period >= 1 && period <= 3) return "pre-klinik";
  if (period != null && period >= 4 && period <= 5) return "klinik";
  return "intorn";
}

export function studentHomeHref(period?: number | null): Href {
  return `/ogrenci/${studentArea(period)}`;
}

/**
 * OCP — Yeni bir rol eklendiğinde yalnızca bu map güncellenir,
 * çağıran bileşenler (app/index.tsx vb.) değişmez.
 */
export const ROLE_HOME_HREF: Record<string, (user: User) => Href> = {
  student: (u) => studentHomeHref((u as StudentUser).period),
  faculty: () => "/akademisyen",
};
