/**
 * hooks/klinik.ts — Klinik staj (Dönem 4-5) ve intörn hook'ları.
 *
 * SRP: Yalnızca klinik staj takvimi, staj bloğu ve nöbet hook'ları.
 */
import { fetchInternship, fetchClinicalSchedule, fetchShifts } from "../index";
import { useAuthedResource } from "./core";
import type { AsyncState } from "./core";
import type { ClinicalScheduleDay, InternshipBlock, Shift } from "../types";

export function useInternship(enabled = true): AsyncState<InternshipBlock> {
  return useAuthedResource(fetchInternship, enabled);
}

export function useClinicalSchedule(enabled = true): AsyncState<ClinicalScheduleDay[]> {
  return useAuthedResource(fetchClinicalSchedule, enabled);
}

export function useShifts(enabled = true): AsyncState<Shift[]> {
  return useAuthedResource(fetchShifts, enabled);
}
