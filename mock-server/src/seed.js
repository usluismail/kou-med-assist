/**
 * Seed data — KOÜ Tıp Fakültesi Mock Veri Tabanı
 *
 * Dönem 1-6 + Akademisyen için tüm ekran verilerini kapsar.
 * Gerçek ÖBS entegrasyonunda sadece base URL değişir.
 */

// ─────────────────────────────────────────────────────────
// AKADEMİSYENLER / DANIŞMANLAR
// ─────────────────────────────────────────────────────────
const supervisors = [
  { id: "sup-1", name: "Prof. Dr. Mehmet Öz", department: "Acil Tıp" },
  { id: "sup-2", name: "Doç. Dr. Ayşe Kaya", department: "Pediatri" },
  { id: "sup-3", name: "Dr. Öğr. Üyesi Ali Can", department: "Genel Cerrahi" },
  { id: "sup-4", name: "Prof. Dr. Fatma Şahin", department: "Anatomi" },
  { id: "sup-5", name: "Doç. Dr. Kemal Demir", department: "Fizyoloji" },
  { id: "sup-6", name: "Dr. Öğr. Üyesi Selin Çelik", department: "Biyokimya" },
  { id: "sup-7", name: "Prof. Dr. Hasan Arslan", department: "Dahiliye" },
  { id: "sup-8", name: "Doç. Dr. Neslihan Kurt", department: "Kadın Doğum" },
];

const advisors = [
  {
    id: "adv-1",
    name: "Prof. Dr. Fatma Şahin",
    title: "Prof. Dr.",
    department: "Anatomi Anabilim Dalı",
    office: "B Blok - 214",
    officeHours: "Salı 10:00-12:00, Perşembe 14:00-16:00",
    email: "fatma.sahin@kocaeli.edu.tr",
    phone: "+90 262 303 72 00",
    photoUrl: null,
  },
  {
    id: "adv-2",
    name: "Doç. Dr. Kemal Demir",
    title: "Doç. Dr.",
    department: "Fizyoloji Anabilim Dalı",
    office: "A Blok - 118",
    officeHours: "Pazartesi 13:00-15:00, Çarşamba 10:00-12:00",
    email: "kemal.demir@kocaeli.edu.tr",
    phone: "+90 262 303 72 10",
    photoUrl: null,
  },
];

// ─────────────────────────────────────────────────────────
// KULLANICILAR (tüm dönemler + akademisyen)
// ─────────────────────────────────────────────────────────
const users = [
  // Dönem 1
  {
    id: "user-student-d1",
    email: "zeynep.arslan@kocaeli.edu.tr",
    password: "ogrenci123",
    role: "student",
    name: "Zeynep Arslan",
    studentNo: "240101010",
    period: 1,
    department: "Tıp Fakültesi",
    faculty: "Kocaeli Üniversitesi Tıp Fakültesi",
    initials: "ZA",
    committeeGroup: "Grup A",
    currentCommittee: "2. Kurul: Kas-İskelet Sistemi",
    committeeWeek: 2,
    committeeTotalWeeks: 5,
    advisorId: "adv-1",
    rotation: "Dönem 1 · 2. Kurul",
  },
  // Dönem 2
  {
    id: "user-student-d2",
    email: "can.yilmaz@kocaeli.edu.tr",
    password: "ogrenci123",
    role: "student",
    name: "Can Yılmaz",
    studentNo: "230101022",
    period: 2,
    department: "Tıp Fakültesi",
    faculty: "Kocaeli Üniversitesi Tıp Fakültesi",
    initials: "CY",
    committeeGroup: "Grup B",
    currentCommittee: "3. Kurul: Dolaşım ve Solunum Sistemi",
    committeeWeek: 3,
    committeeTotalWeeks: 6,
    advisorId: "adv-1",
    rotation: "Dönem 2 · 3. Kurul",
  },
  // Dönem 3
  {
    id: "user-student-d3",
    email: "selin.kurt@kocaeli.edu.tr",
    password: "ogrenci123",
    role: "student",
    name: "Selin Kurt",
    studentNo: "220101031",
    period: 3,
    department: "Tıp Fakültesi",
    faculty: "Kocaeli Üniversitesi Tıp Fakültesi",
    initials: "SK",
    committeeGroup: "Grup A",
    currentCommittee: "4. Kurul: Sinir Sistemi ve Duyular",
    committeeWeek: 1,
    committeeTotalWeeks: 7,
    advisorId: "adv-2",
    rotation: "Dönem 3 · 4. Kurul",
  },
  // Dönem 4
  {
    id: "user-student-d4",
    email: "mert.aslan@kocaeli.edu.tr",
    password: "ogrenci123",
    role: "student",
    name: "Mert Aslan",
    studentNo: "210101044",
    period: 4,
    department: "Tıp Fakültesi",
    faculty: "Kocaeli Üniversitesi Tıp Fakültesi",
    initials: "MA",
    internshipBlock: {
      name: "Dahiliye Stajı",
      week: 3,
      rotation: "Kardiyoloji Rotasyonu",
      supervisorId: "sup-7",
      startDate: "2026-08-18",
      endDate: "2026-09-12",
    },
    rotation: "Dönem 4 · Dahiliye - Kardiyoloji",
    faculty: "Kocaeli Üniversitesi Tıp Fakültesi",
  },
  // Dönem 5
  {
    id: "user-student-d5",
    email: "elif.demir@kocaeli.edu.tr",
    password: "ogrenci123",
    role: "student",
    name: "Elif Demir",
    studentNo: "200101055",
    period: 5,
    department: "Tıp Fakültesi",
    faculty: "Kocaeli Üniversitesi Tıp Fakültesi",
    initials: "ED",
    internshipBlock: {
      name: "Pediatri Stajı",
      week: 2,
      rotation: "Pediatrik Kardiyoloji",
      supervisorId: "sup-2",
      startDate: "2026-08-25",
      endDate: "2026-09-19",
    },
    rotation: "Dönem 5 · Pediatri - Pediatrik Kardiyoloji",
  },
  // Dönem 6 (İntörn)
  {
    id: "user-student-1",
    email: "ahmet.yilmaz@kocaeli.edu.tr",
    password: "ogrenci123",
    role: "student",
    name: "İnt. Dr. Ahmet Yılmaz",
    studentNo: "190101044",
    period: 6,
    department: "Acil Tıp Anabilim Dalı",
    faculty: "Kocaeli Üniversitesi Tıp Fakültesi",
    initials: "AY",
    rotation: "Dönem 6 · Acil Tıp Anabilim Dalı",
  },
  // Akademisyen
  {
    id: "user-faculty-1",
    email: "ayse.kaya@kocaeli.edu.tr",
    password: "hoca123",
    role: "faculty",
    name: "Doç. Dr. Ayşe Kaya",
    department: "Pediatri Anabilim Dalı · Eğitim Sorumlusu",
    faculty: "Kocaeli Üniversitesi Tıp Fakültesi",
    initials: "AK",
  },
];

// ─────────────────────────────────────────────────────────
// YEMEKHANESİ MENÜSÜ (son 7 gün + bu hafta)
// ─────────────────────────────────────────────────────────
const cafeteriaMenus = [
  {
    date: "2026-09-01",
    meals: {
      breakfast: [
        { name: "Menemen", calories: 210, allergens: ["yumurta", "gluten"] },
        { name: "Peynir Tabağı", calories: 180 },
        { name: "Zeytin", calories: 80 },
        { name: "Çay", calories: 5 },
      ],
      lunch: [
        { name: "Mercimek Çorbası", calories: 150 },
        { name: "Tavuk Şinitzel", calories: 380, allergens: ["gluten"] },
        { name: "Bulgur Pilavı", calories: 220 },
        { name: "Cacık", calories: 90 },
        { name: "Meyve", calories: 60 },
      ],
      dinner: [
        { name: "Domates Çorbası", calories: 120 },
        { name: "Köfte", calories: 350 },
        { name: "Makarna", calories: 280, allergens: ["gluten"] },
        { name: "Salata", calories: 70 },
      ],
    },
  },
  {
    date: "2026-09-02",
    meals: {
      breakfast: [
        { name: "Haşlanmış Yumurta", calories: 155, allergens: ["yumurta"] },
        { name: "Beyaz Peynir", calories: 100 },
        { name: "Domates - Salatalık", calories: 40 },
        { name: "Çay", calories: 5 },
      ],
      lunch: [
        { name: "Yayla Çorbası", calories: 130, allergens: ["gluten"] },
        { name: "Et Sote", calories: 410 },
        { name: "Pirinç Pilavı", calories: 240 },
        { name: "Ayran", calories: 60 },
        { name: "Sütlaç", calories: 180, allergens: ["süt"] },
      ],
      dinner: [
        { name: "Ezogelin Çorbası", calories: 140 },
        { name: "Bezelye Yemeği", calories: 220 },
        { name: "Erişte", calories: 260, allergens: ["gluten"] },
        { name: "Meyve", calories: 70 },
      ],
    },
  },
  {
    date: "2026-09-03",
    meals: {
      breakfast: [
        { name: "Sahanda Yumurta", calories: 190, allergens: ["yumurta"] },
        { name: "Kaşar Peyniri", calories: 120, allergens: ["süt"] },
        { name: "Bal - Tereyağı", calories: 140 },
        { name: "Çay", calories: 5 },
      ],
      lunch: [
        { name: "İşkembe Çorbası", calories: 170 },
        { name: "Kuru Fasulye", calories: 310 },
        { name: "Bulgur Pilavı", calories: 220 },
        { name: "Turşu", calories: 25 },
        { name: "Komposto", calories: 90 },
      ],
      dinner: [
        { name: "Patates Çorbası", calories: 160 },
        { name: "Tavuk Sote", calories: 300 },
        { name: "Makarna", calories: 280, allergens: ["gluten"] },
        { name: "Salata", calories: 65 },
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────
// DÖNEM 1-3: DERS PROGRAMI (Pre-Klinik)
// ─────────────────────────────────────────────────────────
const preKlinikSchedule = {
  "user-student-d1": [
    // Pazartesi
    { day: "Mon", time: "08:30", endTime: "09:20", subject: "Anatomi I - Hareket Sistemi", room: "Amfi 1", instructorId: "sup-4", type: "lecture" },
    { day: "Mon", time: "09:30", endTime: "10:20", subject: "Histoloji ve Embriyoloji", room: "Amfi 1", instructorId: "sup-4", type: "lecture" },
    { day: "Mon", time: "10:30", endTime: "12:30", subject: "Anatomi Laboratuvarı", room: "Lab 1", instructorId: "sup-4", type: "lab" },
    // Salı
    { day: "Tue", time: "08:30", endTime: "10:20", subject: "Fizyoloji I - Hücre Fizyolojisi", room: "Amfi 2", instructorId: "sup-5", type: "lecture" },
    { day: "Tue", time: "10:30", endTime: "12:20", subject: "Tıbbi Biyokimya", room: "Amfi 2", instructorId: "sup-6", type: "lecture" },
    // Çarşamba
    { day: "Wed", time: "08:30", endTime: "10:20", subject: "Anatomi I - Hareket Sistemi", room: "Amfi 1", instructorId: "sup-4", type: "lecture" },
    { day: "Wed", time: "10:30", endTime: "12:20", subject: "Fizyoloji Laboratuvarı", room: "Lab 2", instructorId: "sup-5", type: "lab" },
    // Perşembe
    { day: "Thu", time: "08:30", endTime: "10:20", subject: "Tıbbi Biyoloji ve Genetik", room: "Amfi 3", instructorId: "sup-6", type: "lecture" },
    { day: "Thu", time: "10:30", endTime: "12:20", subject: "Tıbbi Biyokimya", room: "Amfi 3", instructorId: "sup-6", type: "lecture" },
    // Cuma
    { day: "Fri", time: "08:30", endTime: "10:20", subject: "Histoloji Laboratuvarı", room: "Lab 3", instructorId: "sup-4", type: "lab" },
    { day: "Fri", time: "10:30", endTime: "12:20", subject: "Davranış Bilimleri", room: "Amfi 1", instructorId: "sup-5", type: "lecture" },
  ],
  "user-student-d2": [
    { day: "Mon", time: "08:30", endTime: "10:20", subject: "Anatomi II - Sindirim Sistemi", room: "Amfi 1", instructorId: "sup-4", type: "lecture" },
    { day: "Mon", time: "10:30", endTime: "12:30", subject: "Anatomi Laboratuvarı", room: "Lab 1", instructorId: "sup-4", type: "lab" },
    { day: "Tue", time: "08:30", endTime: "10:20", subject: "Fizyoloji II - Dolaşım Sistemi", room: "Amfi 2", instructorId: "sup-5", type: "lecture" },
    { day: "Tue", time: "10:30", endTime: "12:20", subject: "Patoloji I", room: "Amfi 2", instructorId: "sup-6", type: "lecture" },
    { day: "Wed", time: "08:30", endTime: "10:20", subject: "Mikrobiyoloji", room: "Amfi 1", instructorId: "sup-6", type: "lecture" },
    { day: "Wed", time: "10:30", endTime: "12:20", subject: "Fizyoloji Laboratuvarı", room: "Lab 2", instructorId: "sup-5", type: "lab" },
    { day: "Thu", time: "08:30", endTime: "10:20", subject: "Farmakoloji I", room: "Amfi 3", instructorId: "sup-6", type: "lecture" },
    { day: "Thu", time: "10:30", endTime: "12:20", subject: "Patoloji Laboratuvarı", room: "Lab 3", instructorId: "sup-6", type: "lab" },
    { day: "Fri", time: "08:30", endTime: "10:20", subject: "Tıp Tarihi ve Deontoloji", room: "Amfi 1", instructorId: "sup-5", type: "lecture" },
    { day: "Fri", time: "10:30", endTime: "12:20", subject: "Anatomi II - Sindirim Sistemi", room: "Amfi 1", instructorId: "sup-4", type: "lecture" },
  ],
  "user-student-d3": [
    { day: "Mon", time: "08:30", endTime: "10:20", subject: "Nöroanatomi", room: "Amfi 1", instructorId: "sup-4", type: "lecture" },
    { day: "Mon", time: "10:30", endTime: "12:30", subject: "Anatomi Laboratuvarı", room: "Lab 1", instructorId: "sup-4", type: "lab" },
    { day: "Tue", time: "08:30", endTime: "10:20", subject: "Patoloji II", room: "Amfi 2", instructorId: "sup-6", type: "lecture" },
    { day: "Tue", time: "10:30", endTime: "12:20", subject: "Farmakoloji II", room: "Amfi 2", instructorId: "sup-6", type: "lecture" },
    { day: "Wed", time: "08:30", endTime: "10:20", subject: "Mikrobiyoloji II", room: "Amfi 3", instructorId: "sup-6", type: "lecture" },
    { day: "Wed", time: "10:30", endTime: "12:20", subject: "Klinik Öncesi Beceriler", room: "Lab 2", instructorId: "sup-5", type: "lab" },
    { day: "Thu", time: "08:30", endTime: "11:20", subject: "Parazitoloji", room: "Amfi 1", instructorId: "sup-6", type: "lecture" },
    { day: "Fri", time: "08:30", endTime: "10:20", subject: "Biyoistatistik", room: "Amfi 2", instructorId: "sup-5", type: "lecture" },
    { day: "Fri", time: "10:30", endTime: "12:20", subject: "Patoloji Laboratuvarı", room: "Lab 3", instructorId: "sup-6", type: "lab" },
  ],
};

// ─────────────────────────────────────────────────────────
// DÖNEM 4-5: KLİNİK STAJ TAKVİMİ (Teorik + Pratik)
// ─────────────────────────────────────────────────────────
const clinicalSchedule = {
  "user-student-d4": [
    {
      id: "cs-d4-1",
      date: "2026-09-01",
      morning: {
        type: "theoretical",
        time: "08:30",
        endTime: "12:00",
        subject: "Kardiyoloji Amfi Dersi - EKG Yorumlama",
        location: "Tıp Amfi 2",
        instructorId: "sup-7",
        attendanceRequired: false,
        attendanceVerified: false,
      },
      afternoon: {
        type: "practical",
        time: "13:30",
        endTime: "16:30",
        subject: "Kardiyoloji Polikliniği - Hasta Başı Muayene",
        location: "B Blok 2. Kat - Kardiyoloji Polikliniği",
        instructorId: "sup-7",
        attendanceRequired: true,
        attendanceVerified: false,
      },
    },
    {
      id: "cs-d4-2",
      date: "2026-09-02",
      morning: {
        type: "theoretical",
        time: "08:30",
        endTime: "12:00",
        subject: "Kardiyoloji Amfi Dersi - Ekokardiyografi",
        location: "Tıp Amfi 2",
        instructorId: "sup-7",
        attendanceRequired: false,
        attendanceVerified: false,
      },
      afternoon: {
        type: "practical",
        time: "13:30",
        endTime: "16:30",
        subject: "KVC Servisi - Hasta Takibi",
        location: "C Blok 4. Kat - KVC Servisi",
        instructorId: "sup-7",
        attendanceRequired: true,
        attendanceVerified: true,
      },
    },
    {
      id: "cs-d4-3",
      date: "2026-09-03",
      morning: {
        type: "theoretical",
        time: "08:30",
        endTime: "12:00",
        subject: "Kardiyoloji Seminer - Ritim Bozuklukları",
        location: "Konferans Salonu",
        instructorId: "sup-7",
        attendanceRequired: false,
        attendanceVerified: false,
      },
      afternoon: {
        type: "practical",
        time: "13:30",
        endTime: "16:30",
        subject: "Kateter Lab - Gözlem",
        location: "A Blok 1. Kat - Anjiyo Lab",
        instructorId: "sup-7",
        attendanceRequired: true,
        attendanceVerified: false,
      },
    },
    {
      id: "cs-d4-4",
      date: "2026-09-04",
      morning: {
        type: "theoretical",
        time: "08:30",
        endTime: "12:00",
        subject: "Nöroloji Amfi Dersi - İnme",
        location: "Tıp Amfi 3",
        instructorId: "sup-7",
        attendanceRequired: false,
        attendanceVerified: false,
      },
      afternoon: {
        type: "practical",
        time: "13:30",
        endTime: "16:30",
        subject: "Nöroloji Polikliniği",
        location: "D Blok - Nöroloji Polikliniği",
        instructorId: "sup-7",
        attendanceRequired: true,
        attendanceVerified: false,
      },
    },
    {
      id: "cs-d4-5",
      date: "2026-09-05",
      morning: {
        type: "theoretical",
        time: "08:30",
        endTime: "11:00",
        subject: "Haftalık Değerlendirme Semineri",
        location: "Tıp Amfi 1",
        instructorId: "sup-7",
        attendanceRequired: true,
        attendanceVerified: false,
      },
      afternoon: {
        type: "practical",
        time: "11:30",
        endTime: "13:00",
        subject: "Serbest Klinik Çalışma",
        location: "Dahiliye Servisi",
        instructorId: "sup-7",
        attendanceRequired: false,
        attendanceVerified: false,
      },
    },
  ],
  "user-student-d5": [
    {
      id: "cs-d5-1",
      date: "2026-09-01",
      morning: {
        type: "theoretical",
        time: "08:30",
        endTime: "12:00",
        subject: "Pediatrik Kardiyoloji Amfi Dersi",
        location: "Tıp Amfi 3",
        instructorId: "sup-2",
        attendanceRequired: false,
        attendanceVerified: false,
      },
      afternoon: {
        type: "practical",
        time: "13:30",
        endTime: "16:30",
        subject: "Çocuk Acil Polikliniği - Hasta Başı",
        location: "Çocuk Acil - Zemin Kat",
        instructorId: "sup-2",
        attendanceRequired: true,
        attendanceVerified: true,
      },
    },
    {
      id: "cs-d5-2",
      date: "2026-09-02",
      morning: {
        type: "theoretical",
        time: "08:30",
        endTime: "12:00",
        subject: "Pediatri Seminer - Beslenme",
        location: "Tıp Amfi 3",
        instructorId: "sup-2",
        attendanceRequired: false,
        attendanceVerified: false,
      },
      afternoon: {
        type: "practical",
        time: "13:30",
        endTime: "16:30",
        subject: "Çocuk Servisi Vizit",
        location: "Çocuk Servisi - 3. Kat",
        instructorId: "sup-2",
        attendanceRequired: true,
        attendanceVerified: false,
      },
    },
    {
      id: "cs-d5-3",
      date: "2026-09-03",
      morning: {
        type: "theoretical",
        time: "08:30",
        endTime: "12:00",
        subject: "Yenidoğan Amfi Dersi",
        location: "Tıp Amfi 3",
        instructorId: "sup-2",
        attendanceRequired: false,
        attendanceVerified: false,
      },
      afternoon: {
        type: "practical",
        time: "13:30",
        endTime: "16:30",
        subject: "YBÜ Gözlem - Yenidoğan",
        location: "YBÜ - 2. Kat",
        instructorId: "sup-2",
        attendanceRequired: true,
        attendanceVerified: false,
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// DÖNEM 6: E-KARNE (İntörn)
// ─────────────────────────────────────────────────────────
const eKarne = {
  "user-student-1": {
    studentId: "user-student-1",
    completionRate: 85,
    internships: [
      { name: "Acil Tıp", status: "completed", completedAt: "2026-07-15", supervisorId: "sup-1", signatureStatus: "signed" },
      { name: "Dahiliye", status: "completed", completedAt: "2026-08-02", supervisorId: "sup-7", signatureStatus: "signed" },
      { name: "Kadın Doğum", status: "pending", completedAt: null, supervisorId: "sup-8", signatureStatus: "pending" },
      { name: "Çocuk Sağlığı", status: "not_started", completedAt: null, supervisorId: "sup-2", signatureStatus: "pending" },
      { name: "Psikiyatri", status: "not_started", completedAt: null, supervisorId: "sup-3", signatureStatus: "pending" },
      { name: "Genel Cerrahi", status: "completed", completedAt: "2026-06-20", supervisorId: "sup-3", signatureStatus: "signed" },
    ],
    procedureStats: {
      total: 200,
      completed: 147,
      pending: 12,
    },
    pdfGeneratedAt: "2026-08-28T10:00:00+03:00",
    pdfUrl: null,
    generatedAt: new Date().toISOString(),
  },
};

// ─────────────────────────────────────────────────────────
// PROSEDÜRLER (U-ÇEP / staj logbook)
// ─────────────────────────────────────────────────────────
const procedures = [
  { id: "proc-1", name: "İntravenöz Kanül Takılması (Damar Yolu)", done: 8, total: 10, category: "Girişimsel" },
  { id: "proc-2", name: "Sutür Atma ve Yara Bakımı", done: 5, total: 5, category: "Girişimsel" },
  { id: "proc-3", name: "EKG Çekimi ve Değerlendirme", done: 12, total: 15, category: "Tanısal" },
  { id: "proc-4", name: "Nazogastrik Sonda Uygulaması", done: 1, total: 3, category: "Girişimsel" },
  { id: "proc-5", name: "Arteriyel Kan Gazı Alınması", done: 4, total: 5, category: "Tanısal" },
  { id: "proc-6", name: "İdrar Sondası Takılması", done: 3, total: 4, category: "Girişimsel" },
  { id: "proc-7", name: "Temel Yaşam Desteği (CPR)", done: 6, total: 6, category: "Acil" },
  { id: "proc-8", name: "Periferik Kan Yayması Hazırlama", done: 2, total: 5, category: "Tanısal" },
];

const d4Procedures = [
  { id: "proc-d4-1", name: "Hasta Başı Muayene (Kardiyoloji)", done: 8, total: 10, category: "Klinik" },
  { id: "proc-d4-2", name: "EKG Çekimi ve Değerlendirme", done: 4, total: 6, category: "Tanısal" },
  { id: "proc-d4-3", name: "Damar Yolu Açma (IV Kanül)", done: 3, total: 5, category: "Girişimsel" },
  { id: "proc-d4-4", name: "Venöz Kan Alma", done: 5, total: 8, category: "Girişimsel" },
  { id: "proc-d4-5", name: "Kan Basıncı Ölçümü ve Takibi", done: 6, total: 8, category: "Klinik" },
  { id: "proc-d4-6", name: "Akciğer Oskültasyonu", done: 4, total: 6, category: "Klinik" },
];

const d5Procedures = [
  { id: "proc-d5-1", name: "Pediatrik Fizik Muayene", done: 5, total: 8, category: "Klinik" },
  { id: "proc-d5-2", name: "Bebek Tartı ve Boy Ölçümü", done: 4, total: 5, category: "Klinik" },
  { id: "proc-d5-3", name: "Aşı Uygulaması", done: 2, total: 4, category: "Girişimsel" },
  { id: "proc-d5-4", name: "Pediatrik Damar Yolu", done: 1, total: 3, category: "Girişimsel" },
  { id: "proc-d5-5", name: "Büyüme-Gelişme Değerlendirmesi", done: 3, total: 6, category: "Klinik" },
];

const proceduresByStudent = {
  "user-student-1": procedures,
  "user-student-d4": d4Procedures,
  "user-student-d5": d5Procedures,
};

// ─────────────────────────────────────────────────────────
// LOGBOOK KAYITLARI
// ─────────────────────────────────────────────────────────
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
  {
    id: "log-d4-1",
    encounterId: "ENC-2026-441",
    procedureId: "proc-d4-3",
    procedureName: "Damar Yolu Açma (IV Kanül)",
    date: "2026-08-30T14:20:00+03:00",
    role: "performed",
    supervisorId: "sup-7",
    supervisorName: "Prof. Dr. Hasan Arslan",
    status: "approved",
    studentId: "user-student-d4",
    ageGroup: "adult",
    sex: "m",
  },
  {
    id: "log-d4-2",
    encounterId: "ENC-2026-448",
    procedureId: "proc-d4-2",
    procedureName: "EKG Çekimi ve Değerlendirme",
    date: "2026-09-01T10:15:00+03:00",
    role: "assisted",
    supervisorId: "sup-7",
    supervisorName: "Prof. Dr. Hasan Arslan",
    status: "pending",
    studentId: "user-student-d4",
    ageGroup: "adult",
    sex: "f",
  },
  {
    id: "log-d4-3",
    encounterId: "ENC-2026-452",
    procedureId: "proc-d4-1",
    procedureName: "Hasta Başı Muayene (Kardiyoloji)",
    date: "2026-08-28T09:40:00+03:00",
    role: "performed",
    supervisorId: "sup-7",
    supervisorName: "Prof. Dr. Hasan Arslan",
    status: "approved",
    studentId: "user-student-d4",
    ageGroup: "adult",
    sex: "m",
  },
  {
    id: "log-d5-1",
    encounterId: "ENC-2026-551",
    procedureId: "proc-d5-1",
    procedureName: "Pediatrik Fizik Muayene",
    date: "2026-08-29T11:10:00+03:00",
    role: "performed",
    supervisorId: "sup-2",
    supervisorName: "Doç. Dr. Ayşe Kaya",
    status: "approved",
    studentId: "user-student-d5",
    ageGroup: "child",
    sex: "f",
  },
  {
    id: "log-d5-2",
    encounterId: "ENC-2026-558",
    procedureId: "proc-d5-4",
    procedureName: "Pediatrik Damar Yolu",
    date: "2026-09-01T13:45:00+03:00",
    role: "assisted",
    supervisorId: "sup-2",
    supervisorName: "Doç. Dr. Ayşe Kaya",
    status: "pending",
    studentId: "user-student-d5",
    ageGroup: "child",
    sex: "m",
  },
];

// ─────────────────────────────────────────────────────────
// NÖBET TAKVİMİ
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
// BEKLEYEN ONAYLAR
// ─────────────────────────────────────────────────────────
const pendingApprovals = [
  {
    id: "log-2",
    encounterId: "ENC-2026-874",
    studentId: "user-student-1",
    studentName: "İnt. Dr. Ahmet Yılmaz",
    procedureName: "EKG Çekimi ve Değerlendirme",
    submittedAt: "2026-08-02T19:05:00+03:00",
    studentPeriod: 6,
    studentRotation: "Dönem 6 · Acil Tıp",
  },
  {
    id: "log-pending-zeynep",
    encounterId: "ENC-2026-877",
    studentId: "user-other-1",
    studentName: "İnt. Dr. Zeynep Kaya",
    procedureName: "Nazogastrik Sonda Uygulaması",
    submittedAt: "2026-08-02T23:10:00+03:00",
    studentPeriod: 6,
    studentRotation: "Dönem 6 · Acil Tıp",
  },
  {
    id: "log-pending-mert",
    encounterId: "ENC-2026-881",
    studentId: "user-other-2",
    studentName: "İnt. Dr. Mert Aslan",
    procedureName: "Damar Yolu Açma",
    submittedAt: "2026-08-02T22:40:00+03:00",
    studentPeriod: 6,
    studentRotation: "Dönem 6 · Acil Tıp",
  },
  {
    id: "log-d4-2",
    encounterId: "ENC-2026-448",
    studentId: "user-student-d4",
    studentName: "Mert Aslan",
    procedureName: "EKG Çekimi ve Değerlendirme",
    submittedAt: "2026-09-01T10:15:00+03:00",
    studentPeriod: 4,
    studentRotation: "Dönem 4 · Dahiliye - Kardiyoloji",
  },
  {
    id: "log-d5-2",
    encounterId: "ENC-2026-558",
    studentId: "user-student-d5",
    studentName: "Elif Demir",
    procedureName: "Pediatrik Damar Yolu",
    submittedAt: "2026-09-01T13:45:00+03:00",
    studentPeriod: 5,
    studentRotation: "Dönem 5 · Pediatri - Pediatrik Kardiyoloji",
  },
];

// ─────────────────────────────────────────────────────────
// MESAJLAR (Öğrenci → Hoca/Öğrenci İşleri)
// ─────────────────────────────────────────────────────────
const messages = [
  {
    id: "msg-1",
    senderId: "user-student-1",
    senderName: "İnt. Dr. Ahmet Yılmaz",
    senderStudentNo: "190101044",
    senderPeriod: 6,
    senderRotation: "Dönem 6 · Acil Tıp",
    recipientType: "advisor",
    category: "general",
    subject: "[Dönem 6 - Acil Tıp] 190101044 İnt. Dr. Ahmet Yılmaz - Genel Soru",
    body: "Hocam, nöbet takvimindeki değişiklik hakkında bilgi almak istiyorum.",
    attachments: [],
    sentAt: "2026-08-25T10:30:00+03:00",
    status: "replied",
  },
  {
    id: "msg-2",
    senderId: "user-student-d4",
    senderName: "Mert Aslan",
    senderStudentNo: "210101044",
    senderPeriod: 4,
    senderRotation: "Dönem 4 · Dahiliye",
    recipientType: "student_affairs",
    category: "excuse",
    subject: "[Dönem 4 - Dahiliye] 210101044 Mert Aslan - Mazeret / Sağlık Raporu",
    body: "Öğrenci İşleri'ne, 29 Ağustos tarihinde rahatsızlığım nedeniyle pratik derse katılamadım. Sağlık raporumu ekliyorum.",
    attachments: ["saglik-raporu.jpg"],
    sentAt: "2026-08-30T09:15:00+03:00",
    status: "sent",
  },
];

// ─────────────────────────────────────────────────────────
// DUYURULAR (Hoca → Öğrenciler)
// ─────────────────────────────────────────────────────────
const announcements = [
  {
    id: "ann-1",
    authorId: "user-faculty-1",
    authorName: "Doç. Dr. Ayşe Kaya",
    targetAudience: [{ type: "internship_group", period: 5, group: "Pediatri Staj Grubu A" }],
    actionType: "room_changed",
    title: "Pediatri Pratik - Konum Değişikliği",
    body: "Bugünkü 14:00 Genel Cerrahi pratik dersi Amfi 1 yerine Konferans Salonunda yapılacaktır.",
    originalLesson: "Pediatri Polikliniği Pratik",
    sentAt: "2026-08-31T11:00:00+03:00",
    channels: ["push", "email", "in_app"],
    isRead: false,
  },
  {
    id: "ann-2",
    authorId: "user-faculty-1",
    authorName: "Doç. Dr. Ayşe Kaya",
    targetAudience: [{ type: "all_interns" }],
    actionType: "general",
    title: "İntörn Karne Teslim Tarihi Hatırlatması",
    body: "Tüm intörnlerimize hatırlatma: E-karne son giriş tarihi 15 Eylül 2026'dır. Eksik girişlerinizi tamamlayınız.",
    originalLesson: null,
    sentAt: "2026-08-30T09:00:00+03:00",
    channels: ["push", "email", "in_app"],
    isRead: true,
  },
  {
    id: "ann-3",
    authorId: "user-faculty-1",
    authorName: "Doç. Dr. Ayşe Kaya",
    targetAudience: [{ type: "period_committee", period: 2, group: "3. Kurul" }],
    actionType: "cancelled",
    title: "Fizyoloji Dersi İptal",
    body: "02 Eylül Salı günü 10:30 Fizyoloji II dersi iptal edilmiştir. Telafi dersi duyurulacaktır.",
    originalLesson: "Fizyoloji II - Dolaşım Sistemi",
    sentAt: "2026-09-01T08:00:00+03:00",
    channels: ["push", "email", "in_app"],
    isRead: false,
  },
];

// ─────────────────────────────────────────────────────────
// ARKADAŞLAR (nöbet takas için)
// ─────────────────────────────────────────────────────────
const colleagues = [
  { id: "col-1", name: "İnt. Dr. Zeynep Kaya" },
  { id: "col-2", name: "İnt. Dr. Mert Aslan" },
  { id: "col-3", name: "İnt. Dr. Elif Demir" },
];

// ─────────────────────────────────────────────────────────
// OSCE
// ─────────────────────────────────────────────────────────
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
  { id: "station-1", sessionId: "osce-1", number: 1, title: "Temel Yaşam Desteği", durationSec: 300 },
  { id: "station-2", sessionId: "osce-1", number: 2, title: "EKG Yorumlama", durationSec: 300 },
  {
    id: "station-3",
    sessionId: "osce-1",
    number: 3,
    title: "Solunum Sistemi Muayenesi",
    durationSec: 255,
    candidate: { id: "cand-zk", name: "Zeynep Kaya", code: "104", initials: "ZK", group: "Dönem 6 · Grup B" },
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
      { id: "q2", prompt: "2. İletişim ve aydınlatılmış onam.", type: "likert", max: 5 },
    ],
  },
  { id: "station-4", sessionId: "osce-1", number: 4, title: "Sutür ve Yara Bakımı", durationSec: 300 },
];

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

// ─────────────────────────────────────────────────────────
// NOT / KURUL SONUÇLARI (Pre-Klinik Dönem 1-3)
// ─────────────────────────────────────────────────────────
const grades = {
  "user-student-d1": {
    period: 1,
    gpa: 3.1,
    committees: [
      {
        id: "c1-k1",
        name: "1. Kurul: Hücre Biyolojisi",
        status: "completed",
        courses: [
          { name: "Anatomi I", score: 74, letterGrade: "CB", passed: true },
          { name: "Fizyoloji I", score: 68, letterGrade: "CC", passed: true },
          { name: "Histoloji ve Embriyoloji", score: 71, letterGrade: "CB", passed: true },
          { name: "Tıbbi Biyoloji ve Genetik", score: 65, letterGrade: "CC", passed: true },
          { name: "Davranış Bilimleri", score: 80, letterGrade: "BA", passed: true },
        ],
      },
      {
        id: "c1-k2",
        name: "2. Kurul: Kas-İskelet Sistemi",
        status: "ongoing",
        courses: [
          { name: "Anatomi I", score: null, letterGrade: null, passed: null },
          { name: "Fizyoloji I", score: null, letterGrade: null, passed: null },
          { name: "Tıbbi Biyokimya", score: null, letterGrade: null, passed: null },
          { name: "Histoloji ve Embriyoloji", score: null, letterGrade: null, passed: null },
        ],
      },
    ],
  },
  "user-student-d2": {
    period: 2,
    gpa: 3.4,
    committees: [
      {
        id: "c2-k1",
        name: "1. Kurul: Kardiyovasküler Sistem",
        status: "completed",
        courses: [
          { name: "Anatomi II", score: 82, letterGrade: "BA", passed: true },
          { name: "Fizyoloji II", score: 78, letterGrade: "BB", passed: true },
          { name: "Patoloji I", score: 72, letterGrade: "CB", passed: true },
          { name: "Farmakoloji I", score: 69, letterGrade: "CC", passed: true },
          { name: "Mikrobiyoloji", score: 85, letterGrade: "BA", passed: true },
        ],
      },
      {
        id: "c2-k2",
        name: "2. Kurul: Solunum Sistemi",
        status: "completed",
        courses: [
          { name: "Anatomi II", score: 79, letterGrade: "BB", passed: true },
          { name: "Fizyoloji II", score: 74, letterGrade: "CB", passed: true },
          { name: "Patoloji I", score: 68, letterGrade: "CC", passed: true },
          { name: "Farmakoloji I", score: 76, letterGrade: "BB", passed: true },
        ],
      },
      {
        id: "c2-k3",
        name: "3. Kurul: Dolaşım ve Solunum Sistemi",
        status: "ongoing",
        courses: [
          { name: "Anatomi II", score: null, letterGrade: null, passed: null },
          { name: "Fizyoloji II", score: null, letterGrade: null, passed: null },
          { name: "Mikrobiyoloji", score: null, letterGrade: null, passed: null },
          { name: "Patoloji I", score: null, letterGrade: null, passed: null },
          { name: "Tıp Tarihi ve Deontoloji", score: null, letterGrade: null, passed: null },
        ],
      },
    ],
  },
  "user-student-d3": {
    period: 3,
    gpa: 3.7,
    committees: [
      {
        id: "c3-k1",
        name: "1. Kurul: Endokrin ve Metabolizma",
        status: "completed",
        courses: [
          { name: "Patoloji II", score: 88, letterGrade: "AA", passed: true },
          { name: "Farmakoloji II", score: 84, letterGrade: "BA", passed: true },
          { name: "Mikrobiyoloji II", score: 79, letterGrade: "BB", passed: true },
          { name: "Biyoistatistik", score: 90, letterGrade: "AA", passed: true },
        ],
      },
      {
        id: "c3-k2",
        name: "2. Kurul: Üreme ve Gelişim",
        status: "completed",
        courses: [
          { name: "Patoloji II", score: 85, letterGrade: "BA", passed: true },
          { name: "Farmakoloji II", score: 80, letterGrade: "BA", passed: true },
          { name: "Parazitoloji", score: 77, letterGrade: "BB", passed: true },
          { name: "Klinik Öncesi Beceriler", score: 92, letterGrade: "AA", passed: true },
        ],
      },
      {
        id: "c3-k3",
        name: "3. Kurul: Sindirim Sistemi",
        status: "completed",
        courses: [
          { name: "Nöroanatomi", score: 83, letterGrade: "BA", passed: true },
          { name: "Patoloji II", score: 81, letterGrade: "BA", passed: true },
          { name: "Mikrobiyoloji II", score: 76, letterGrade: "BB", passed: true },
          { name: "Biyoistatistik", score: 88, letterGrade: "AA", passed: true },
        ],
      },
      {
        id: "c3-k4",
        name: "4. Kurul: Sinir Sistemi ve Duyular",
        status: "ongoing",
        courses: [
          { name: "Nöroanatomi", score: null, letterGrade: null, passed: null },
          { name: "Patoloji II", score: null, letterGrade: null, passed: null },
          { name: "Farmakoloji II", score: null, letterGrade: null, passed: null },
          { name: "Parazitoloji", score: null, letterGrade: null, passed: null },
        ],
      },
    ],
  },
};

module.exports = {
  users,
  supervisors,
  advisors,
  procedures,
  proceduresByStudent,
  logs,
  shifts,
  pendingApprovals,
  colleagues,
  osceSessions,
  osceStations,
  studentOsceProgress,
  cafeteriaMenus,
  preKlinikSchedule,
  clinicalSchedule,
  eKarne,
  messages,
  announcements,
  grades,
};
