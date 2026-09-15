/**
 * hooks/logbook.ts — Logbook & öğrenci kayıt hook'ları.
 *
 * SRP: Yalnızca logbook ve procedure domain'ine ait hook'lar.
 * DIP: Bileşenler createLog'u doğrudan import etmez; useCreateLog üzerinden erişir.
 */
import { useCallback } from "react";
import {
  fetchStudentDashboard,
  fetchLogs,
  fetchProcedures,
  fetchSupervisors,
  fetchColleagues,
} from "../index";
import { createLog } from "../student/logbook";
import { useAuthedResource, useMutation } from "./core";
import type { AsyncState, MutationResult } from "./core";
import type {
  Colleague,
  CreateLogInput,
  CreateLogResponse,
  LogEntry,
  ProcedureProgress,
  StudentDashboard,
  Supervisor,
} from "../types";

export function useStudentDashboard(enabled = true): AsyncState<StudentDashboard> {
  return useAuthedResource(fetchStudentDashboard, enabled);
}

export function useLogs(enabled = true): AsyncState<LogEntry[]> {
  return useAuthedResource(fetchLogs, enabled);
}

export function useProcedures(enabled = true): AsyncState<ProcedureProgress[]> {
  return useAuthedResource(fetchProcedures, enabled);
}

export function useSupervisors(enabled = true): AsyncState<Supervisor[]> {
  return useAuthedResource(fetchSupervisors, enabled);
}

export function useColleagues(enabled = true): AsyncState<Colleague[]> {
  return useAuthedResource(fetchColleagues, enabled);
}

/**
 * useCreateLog — DIP uygular.
 * Bileşenler createLog'u doğrudan import etmez; bu hook üzerinden erişir.
 * useMutation generic sayesinde loading/error/reset boilerplate kaldırıldı.
 */
export function useCreateLog(): MutationResult<CreateLogInput, CreateLogResponse> {
  const fn = useCallback(
    (token: string, input: CreateLogInput) => createLog(token, input),
    [],
  );
  return useMutation(fn, "Kayıt gönderilemedi");
}
