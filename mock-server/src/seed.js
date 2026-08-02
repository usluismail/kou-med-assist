/** Seed data — eski lib/med-data.ts içeriğinin API karşılığı */

const supervisors = [
  { id: "sup-1", name: "Prof. Dr. Mehmet Öz" },
  { id: "sup-2", name: "Doç. Dr. Ayşe Kaya" },
  { id: "sup-3", name: "Dr. Öğr. Üyesi Ali Can" },
];

const users = [
  {
    id: "user-student-1",
    email: "ahmet.yilmaz@kocaeli.edu.tr",
    password: "ogrenci123",
    role: "student",
    name: "İnt. Dr. Ahmet Yılmaz",
    studentNo: "190101044",
    department: "Acil Tıp Anabilim Dalı",
    rotation: "Dönem 6 · Acil Tıp Anabilim Dalı",
    faculty: "Kocaeli Üniversitesi Tıp Fakültesi",
    initials: "AY",
  },
  {
    id: "user-faculty-1",
    email: "ayse.kaya@kocaeli.edu.tr",
    password: "hoca123",
    role: "faculty",
    name: "Doç. Dr. Ayşe Kaya",
    department: "Acil Tıp AD · Eğitim Sorumlusu",
    faculty: "Kocaeli Üniversitesi Tıp Fakültesi",
    initials: "AK",
  },
];

const procedures = [
  {
    id: "proc-1",
    name: "İntravenöz Kanül Takılması (Damar Yolu)",
    done: 8,
    total: 10,
  },
  {
    id: "proc-2",
    name: "Sutür Atma ve Yara Bakımı",
    done: 5,
    total: 5,
  },
  {
    id: "proc-3",
    name: "EKG Çekimi ve Değerlendirme",
    done: 12,
    total: 15,
  },
  {
    id: "proc-4",
    name: "Nazogastrik Sonda Uygulaması",
    done: 1,
    total: 3,
  },
];

const logs = [
  {
    id: "log-1",
    encounterId: "ENC-2026-881",
    procedureId: "proc-1",
    procedureName: "Damar Yolu Açma / İntravenöz Kanül",
    date: "2026-08-02T23:40:00+03:00",
    role: "performed",
    supervisorId: "sup-2",
    supervisorName: "Doç. Dr. Ayşe Kaya",
    status: "approved",
    studentId: "user-student-1",
    ageGroup: "adult",
    sex: "m",
  },
  {
    id: "log-2",
    encounterId: "ENC-2026-874",
    procedureId: "proc-3",
    procedureName: "EKG Çekimi ve Değerlendirme",
    date: "2026-08-02T19:05:00+03:00",
    role: "assisted",
    supervisorId: "sup-1",
    supervisorName: "Prof. Dr. Mehmet Öz",
    status: "pending",
    studentId: "user-student-1",
    ageGroup: "adult",
    sex: "f",
  },
  {
    id: "log-3",
    encounterId: "ENC-2026-862",
    procedureId: "proc-2",
    procedureName: "Sutür Atma ve Yara Bakımı",
    date: "2026-07-31T03:12:00+03:00",
    role: "performed",
    supervisorId: "sup-3",
    supervisorName: "Dr. Öğr. Üyesi Ali Can",
    status: "approved",
    studentId: "user-student-1",
    ageGroup: "adult",
    sex: "m",
  },
];

const shifts = [
  {
    id: "shift-1",
    day: 2,
    label: "02 Ağustos 2026",
    time: "16:00 - 08:00",
    area: "Acil Kırmızı Alan",
    state: "completed",
    partners: ["İnt. Dr. Zeynep Kaya", "İnt. Dr. Mert Aslan"],
    studentId: "user-student-1",
  },
  {
    id: "shift-2",
    day: 5,
    label: "05 Ağustos 2026",
    time: "16:00 - 08:00",
    area: "Acil Yeşil Alan",
    state: "upcoming",
    partners: ["İnt. Dr. Elif Demir"],
    studentId: "user-student-1",
  },
  {
    id: "shift-3",
    day: 9,
    label: "09 Ağustos 2026",
    time: "00:00 - 08:00",
    area: "Acil Travma / Gece",
    state: "night",
    partners: ["İnt. Dr. Zeynep Kaya"],
    studentId: "user-student-1",
  },
  {
    id: "shift-4",
    day: 14,
    label: "14 Ağustos 2026",
    time: "16:00 - 08:00",
    area: "Acil Sarı Alan",
    state: "upcoming",
    partners: ["İnt. Dr. Can Yücel"],
    studentId: "user-student-1",
  },
];

const pendingApprovals = [
  {
    id: "log-2",
    encounterId: "ENC-2026-874",
    studentId: "user-student-1",
    studentName: "İnt. Dr. Ahmet Yılmaz",
    procedureName: "EKG Çekimi ve Değerlendirme",
    submittedAt: "2026-08-02T19:05:00+03:00",
  },
  {
    id: "log-pending-zeynep",
    encounterId: "ENC-2026-877",
    studentId: "user-other-1",
    studentName: "İnt. Dr. Zeynep Kaya",
    procedureName: "Nazogastrik Sonda Uygulaması",
    submittedAt: "2026-08-02T23:10:00+03:00",
  },
  {
    id: "log-pending-mert",
    encounterId: "ENC-2026-881",
    studentId: "user-other-2",
    studentName: "İnt. Dr. Mert Aslan",
    procedureName: "Damar Yolu Açma",
    submittedAt: "2026-08-02T22:40:00+03:00",
  },
];

const colleagues = [
  { id: "col-1", name: "İnt. Dr. Zeynep Kaya" },
  { id: "col-2", name: "İnt. Dr. Mert Aslan" },
  { id: "col-3", name: "İnt. Dr. Elif Demir" },
];

const osceSessions = [
  {
    id: "osce-1",
    title: "Acil Tıp OSCE Sınavı",
    date: "2026-08-28",
    time: "09:00",
    status: "upcoming",
    stationCount: 4,
    department: "Acil Tıp",
  },
];

const osceStations = [
  {
    id: "station-1",
    sessionId: "osce-1",
    number: 1,
    title: "Temel Yaşam Desteği",
    durationSec: 300,
  },
  {
    id: "station-2",
    sessionId: "osce-1",
    number: 2,
    title: "EKG Yorumlama",
    durationSec: 300,
  },
  {
    id: "station-3",
    sessionId: "osce-1",
    number: 3,
    title: "Solunum Sistemi Muayenesi",
    durationSec: 255,
    candidate: {
      id: "cand-zk",
      name: "Zeynep Kaya",
      code: "104",
      initials: "ZK",
      group: "Dönem 6 · Grup B",
    },
    checklist: [
      {
        id: "q1",
        prompt: "1. Hastanın sırtını doğru pozisyonda oskülte etti.",
        type: "tri",
        options: [
          { value: "yes", label: "Evet", points: 5 },
          { value: "partial", label: "Kısmen", points: 2.5 },
          { value: "no", label: "Hayır", points: 0 },
        ],
      },
      {
        id: "q2",
        prompt: "2. İletişim ve aydınlatılmış onam.",
        type: "likert",
        max: 5,
      },
    ],
  },
  {
    id: "station-4",
    sessionId: "osce-1",
    number: 4,
    title: "Sutür ve Yara Bakımı",
    durationSec: 300,
  },
];

/** Öğrenci görünümü için istasyon ilerleme (seed) */
const studentOsceProgress = {
  "user-student-1": {
    "osce-1": {
      "station-1": { status: "completed", scorePct: 92 },
      "station-2": { status: "completed", scorePct: 88 },
      "station-3": { status: "pending", scorePct: null },
      "station-4": { status: "pending", scorePct: null },
    },
  },
};

module.exports = {
  users,
  supervisors,
  procedures,
  logs,
  shifts,
  pendingApprovals,
  colleagues,
  osceSessions,
  osceStations,
  studentOsceProgress,
};