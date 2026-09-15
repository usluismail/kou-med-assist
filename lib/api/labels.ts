import type { AgeGroup, LogRole, LogStatus, Sex } from "./types";

export const logRoleLabel: Record<LogRole, string> = {
  observed: "Gözlemledim",
  assisted: "Yardım Ettim",
  performed: "Bizzat Yaptım",
};

export const logStatusLabel: Record<LogStatus, string> = {
  pending: "BEKLİYOR",
  approved: "ONAYLANDI",
  revision_requested: "DÜZELTME",
};

export const ageGroupLabel: Record<AgeGroup, string> = {
  child: "Pediatrik",
  adult: "Yetişkin",
  geriatric: "Geriatrik",
};

export const sexLabel: Record<Sex, string> = {
  f: "Kadın",
  m: "Erkek",
  other: "Diğer",
};

/** Göreli zaman (tr) — pending listesi için */
export function relativeTimeTr(iso: string, now = Date.now()): string {
  const diffMs = now - new Date(iso).getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

/** ISO → "02 Ağu 2026 · 23:40" */
export function formatLogDateTr(iso: string): string {
  const d = new Date(iso);
  const months = [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  const mon = months[d.getMonth()] ?? "";
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${mon} ${year} · ${hh}:${mm}`;
}
