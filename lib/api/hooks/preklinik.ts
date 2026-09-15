/**
 * hooks/preklinik.ts — Pre-klinik dönem (1-3) hook'ları.
 *
 * SRP: Yalnızca ders programı, danışman ve not hook'ları.
 */
import { fetchSchedule, fetchAdvisor, fetchGrades } from "../index";
import { useAuthedResource } from "./core";
import type { AsyncState } from "./core";
import type { Advisor, Lesson, StudentGrades } from "../types";

export function useSchedule(enabled = true): AsyncState<Lesson[]> {
  return useAuthedResource(fetchSchedule, enabled);
}

export function useAdvisor(enabled = true): AsyncState<Advisor> {
  return useAuthedResource(fetchAdvisor, enabled);
}

export function useGrades(enabled = true): AsyncState<StudentGrades> {
  return useAuthedResource(fetchGrades, enabled);
}
