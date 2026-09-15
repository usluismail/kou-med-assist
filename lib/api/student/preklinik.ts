/**
 * Öğrenci — Pre-Klinik domain (Dönem 1-3).
 * Sorumluluk: ders programı, danışman hoca, notlar.
 */
import { adaptIdentity } from "../adapters";
import { apiRequest } from "../client";
import { endpoints } from "../endpoints";
import type { Advisor, Lesson, StudentGrades } from "../types";

export async function fetchSchedule(token: string): Promise<Lesson[]> {
  return adaptIdentity(
    await apiRequest<Lesson[]>(endpoints.studentSchedule, { token }),
  );
}

export async function fetchAdvisor(token: string): Promise<Advisor> {
  return adaptIdentity(
    await apiRequest<Advisor>(endpoints.studentAdvisor, { token }),
  );
}

export async function fetchGrades(token: string): Promise<StudentGrades> {
  return adaptIdentity(
    await apiRequest<StudentGrades>(endpoints.studentGrades, { token }),
  );
}
