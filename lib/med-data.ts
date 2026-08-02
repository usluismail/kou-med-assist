export const STUDENT = {
  name: "İnt. Dr. Ahmet Yılmaz",
  no: "190101044",
  rotation: "Dönem 6 · Acil Tıp Anabilim Dalı",
  faculty: "Kocaeli Üniversitesi Tıp Fakültesi",
  initials: "AY",
};

export const SUPERVISORS = [
  "Prof. Dr. Mehmet Öz",
  "Doç. Dr. Ayşe Kaya",
  "Dr. Öğr. Üyesi Ali Can",
];

export const PROCEDURES = [
  { name: "İntravenöz Kanül Takılması (Damar Yolu)", done: 8, total: 10 },
  { name: "Sutür Atma ve Yara Bakımı", done: 5, total: 5 },
  { name: "EKG Çekimi ve Değerlendirme", done: 12, total: 15 },
  { name: "Nazogastrik Sonda Uygulaması", done: 1, total: 3 },
];

export const LOG_ENTRIES = [
  {
    id: "ENC-2026-881",
    proc: "Damar Yolu Açma / İntravenöz Kanül",
    date: "02 Ağu 2026 · 23:40",
    role: "Bizzat Yaptım",
    supervisor: "Doç. Dr. Ayşe Kaya",
    status: "onaylandi" as const,
  },
  {
    id: "ENC-2026-874",
    proc: "EKG Çekimi ve Değerlendirme",
    date: "02 Ağu 2026 · 19:05",
    role: "Yardım Ettim",
    supervisor: "Prof. Dr. Mehmet Öz",
    status: "bekliyor" as const,
  },
  {
    id: "ENC-2026-862",
    proc: "Sutür Atma ve Yara Bakımı",
    date: "31 Tem 2026 · 03:12",
    role: "Bizzat Yaptım",
    supervisor: "Dr. Öğr. Üyesi Ali Can",
    status: "onaylandi" as const,
  },
];

export const SHIFTS = [
  {
    day: 2,
    label: "02 Ağustos 2026",
    time: "16:00 - 08:00",
    area: "Acil Kırmızı Alan",
    state: "completed" as const,
    partners: ["İnt. Dr. Zeynep Kaya", "İnt. Dr. Mert Aslan"],
  },
  {
    day: 5,
    label: "05 Ağustos 2026",
    time: "16:00 - 08:00",
    area: "Acil Yeşil Alan",
    state: "upcoming" as const,
    partners: ["İnt. Dr. Elif Demir"],
  },
  {
    day: 9,
    label: "09 Ağustos 2026",
    time: "00:00 - 08:00",
    area: "Acil Travma / Gece",
    state: "night" as const,
    partners: ["İnt. Dr. Zeynep Kaya"],
  },
  {
    day: 14,
    label: "14 Ağustos 2026",
    time: "16:00 - 08:00",
    area: "Acil Sarı Alan",
    state: "upcoming" as const,
    partners: ["İnt. Dr. Can Yücel"],
  },
];

export const COLLEAGUES = [
  "İnt. Dr. Zeynep Kaya",
  "İnt. Dr. Mert Aslan",
  "İnt. Dr. Elif Demir",
];

export const PENDING_APPROVALS = [
  {
    id: "ENC-2026-881",
    student: "İnt. Dr. Ahmet Yılmaz",
    proc: "Damar Yolu Açma",
    time: "5 dk önce",
  },
  {
    id: "ENC-2026-877",
    student: "İnt. Dr. Zeynep Kaya",
    proc: "Nazogastrik Sonda Uygulaması",
    time: "22 dk önce",
  },
  {
    id: "ENC-2026-874",
    student: "İnt. Dr. Mert Aslan",
    proc: "EKG Çekimi ve Değerlendirme",
    time: "1 sa önce",
  },
];
