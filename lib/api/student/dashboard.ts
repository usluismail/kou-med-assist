/**
 * Öğrenci dashboard — özet ekranı.
 * Sorumluluk: öğrenci ana sayfa verileri.
 */
import { adaptIdentity } from "../adapters";
import { apiRequest } from "../client";
import { endpoints } from "../endpoints";
import type { StudentDashboard } from "../types";

export async function fetchStudentDashboard(
  token: string,
): Promise<StudentDashboard> {
  return adaptIdentity(
    await apiRequest<StudentDashboard>(endpoints.studentDashboard, { token }),
  );
}
