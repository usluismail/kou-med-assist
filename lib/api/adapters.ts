/**
 * Backend JSON ↔ UI modeli.
 * Hoca farklı alan adları verince map burada yapılır; ekranlar değişmez.
 */
import type { OsceSession, OsceStation } from "./types";

export function adaptIdentity<T>(data: T): T {
  return data;
}

/**
 * Simülasyon: hocanın farklı isimlendirdiği OSCE session payload'ı.
 * Örn: exam_name / exam_date / station_list
 */
export type LegacyOsceSessionPayload = {
  exam_id: string;
  exam_name: string;
  exam_date: string;
  exam_time?: string;
  exam_status?: string;
  dept?: string;
  station_list?: Array<{
    station_id: string;
    station_title: string;
    completed?: boolean;
    percent?: number | null;
    note?: string;
  }>;
};

export function adaptLegacyOsceSession(
  raw: LegacyOsceSessionPayload,
): OsceSession {
  const stations = (raw.station_list ?? []).map((s) => ({
    id: s.station_id,
    title: s.station_title,
    status: (s.completed ? "done" : "pending") as "done" | "pending",
    score: s.percent ?? null,
    subtitle: s.note ?? (s.completed ? "Pratik tamamlandı" : "Deneme bekliyor"),
  }));
  return {
    id: raw.exam_id,
    title: raw.exam_name,
    date: raw.exam_date,
    time: raw.exam_time ?? "09:00",
    status: raw.exam_status ?? "upcoming",
    stationCount: stations.length,
    department: raw.dept ?? null,
    stations,
  };
}

/** Checklist option value/id birleştir */
export function adaptOsceStation(raw: OsceStation): OsceStation {
  return {
    ...raw,
    globalDefault: raw.globalDefault ?? 65,
    checklist: (raw.checklist ?? []).map((item) => ({
      ...item,
      options: item.options?.map((o) => ({
        ...o,
        id: o.id ?? o.value ?? o.label,
        value: o.value ?? o.id ?? o.label,
      })),
    })),
    candidate: {
      ...raw.candidate,
      period: raw.candidate.period ?? raw.candidate.group?.split("·")[0]?.trim(),
    },
  };
}
