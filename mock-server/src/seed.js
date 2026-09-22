/**
 * Seed data — KOÜ Tıp Fakültesi Mock Veri Tabanı
 *
 * Dönem 1-6 + Akademisyen için tüm ekran verilerini kapsar.
 * Gerçek ÖBS entegrasyonunda sadece base URL değişir.
 */

const fs = require("fs");
const path = require("path");

/** tip.kocaeli.edu.tr scrape → mock-server/data/faculty-directory-live.json */
function loadFacultyDirectoryLive() {
  try {
    const p = path.join(__dirname, "../data/faculty-directory-live.json");
    const json = JSON.parse(fs.readFileSync(p, "utf8"));
    const members = Array.isArray(json?.members) ? json.members : [];
    return members.map((m) => ({
      id: m.id,
      name: m.name,
      title: m.title,
      department: m.department,
      office: m.office ?? null,
      email: m.email ?? null,
      phone: null, // scrape’te telefon yok (santral)
      role: m.role === "chair" || m.role === "dean" || m.role === "advisor" ? m.role : "faculty",
    }));
  } catch {
    return null;
  }
}

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
    date: "2026-09-07",
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
    date: "2026-09-08",
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
    date: "2026-09-09",
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
  {
    date: "2026-09-10",
    meals: {
      breakfast: [
        { name: "Omlet", calories: 200, allergens: ["yumurta"] },
        { name: "Simit", calories: 250, allergens: ["gluten"] },
        { name: "Çay", calories: 5 },
      ],
      lunch: [
        { name: "Sebze Çorbası", calories: 110 },
        { name: "Izgara Köfte", calories: 360 },
        { name: "Pilav", calories: 230 },
        { name: "Cacık", calories: 90 },
        { name: "Meyve", calories: 55 },
      ],
      dinner: [
        { name: "Tarhana", calories: 140 },
        { name: "Nohut Yemeği", calories: 290 },
        { name: "Salata", calories: 70 },
      ],
    },
  },
  {
    date: "2026-09-11",
    meals: {
      breakfast: [
        { name: "Peynir - Zeytin", calories: 160 },
        { name: "Bal", calories: 90 },
        { name: "Çay", calories: 5 },
      ],
      lunch: [
        { name: "Mercimek Çorbası", calories: 150 },
        { name: "Fırın Tavuk", calories: 340 },
        { name: "Makarna", calories: 280, allergens: ["gluten"] },
        { name: "Ayran", calories: 60 },
      ],
      dinner: [
        { name: "Domates Çorbası", calories: 120 },
        { name: "Sebzeli Güveç", calories: 260 },
        { name: "Pilav", calories: 230 },
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
// PORTAL DUYURULARI (giriş öncesi vitrin)
// ─────────────────────────────────────────────────────────
const portalAnnouncements = [
  {
    id: "pa-live-1",
    day: "26",
    month: "AĞU",
    dateIso: "2026-08-26",
    unit: "Tıp Fakültesi",
    title: "2026-2027 Merkezi Yatay Geçiş Sonuçları",
    summary: "2026-2027 Merkezi Yatay Geçiş Sonuçları",
    body: "2026-2027 Merkezi Yatay Geçiş Sonuçları",
    pdfUrl: "https://api.kocaeli.edu.tr/api/FileOperation/OpenFile?filePath=1019/Announcement/Files/2026/08/20260826_c43aa_merkezi-yatay-gecis26-27-4b4.pdf",
    imageUrl: null,
  },
  {
    id: "pa-live-2",
    day: "24",
    month: "AĞU",
    dateIso: "2026-08-24",
    unit: "Tıp Fakültesi",
    title: " BAŞARIYA DAYALI YATAY GEÇİŞ SONUÇLARI",
    summary: "BAŞARIYA DAYALI YATAY GEÇİŞ SONUÇLARI",
    body: "BAŞARIYA DAYALI YATAY GEÇİŞ SONUÇLARI",
    pdfUrl: "https://api.kocaeli.edu.tr/api/FileOperation/OpenFile?filePath=1019/Announcement/Files/2026/08/20260825_1d52b_basariya-dayali-yatay-gecisson-12f.pdf",
    imageUrl: null,
  },
  {
    id: "pa-live-3",
    day: "21",
    month: "TEM",
    dateIso: "2026-07-21",
    unit: "Tıp Fakültesi",
    title: "2026 GÖNÜLLÜ YAZ STAJI",
    summary: "Fakültemizde Gönüllü Yaz Stajı Yapacak Öğrencilerin Dikkatine Staja başlayacağınız gün ekteki formu iki nüsha doldurup öğrenci işleri bürosuna öğrenci belgeniz ile başvurmanız gerekmektedir",
    body: "Fakültemizde Gönüllü Yaz Stajı Yapacak Öğrencilerin Dikkatine Staja başlayacağınız gün ekteki formu iki nüsha doldurup öğrenci işleri bürosuna öğrenci belgeniz ile başvurmanız gerekmektedir",
    pdfUrl: "https://api.kocaeli.edu.tr/api/FileOperation/OpenFile?filePath=1019/Announcement/Files/2026/07/20260721_0f3b6_koutipfakultesigonullustajkabulformu-514.pdf",
    imageUrl: null,
  },
  {
    id: "pa-live-4",
    day: "29",
    month: "HAZ",
    dateIso: "2026-06-29",
    unit: "Tıp Fakültesi",
    title: "FAKÜLTEMİZDE GÖNÜLLÜ YAZ STAJI YAPMAK İSTEYEN ÖĞRENCİLERİN DİKKATİNE!",
    summary: "Değerli Öğrenciler, 2025 – 2026 Eğitim-Öğretim yılı yaz dönemi gönüllü stajlar için başvurular 03 Ağustos 2026 tarihi itibari ile başlayacak ve 28 Ağustos 2026 tarihinde son bulacaktır. Ek 1 tabloda staj açan Anabilim Dalları ve kontenjanları belirtilmiş olup Ek 2’ deki tercih formunu doldurup 17 Temmuz 2026 mesai saati bitimine kadar koutip.ogrenciisleri@kocaeli.edu.tr mail adresine göndermeniz gerekmektedir. Not: 3 tercih hakkınız olup formu doldururken 1. 2. 3 . tercih olarak belirtmeniz gerekmektedir.",
    body: "Değerli Öğrenciler, 2025 – 2026 Eğitim-Öğretim yılı yaz dönemi gönüllü stajlar için başvurular 03 Ağustos 2026 tarihi itibari ile başlayacak ve 28 Ağustos 2026 tarihinde son bulacaktır. Ek 1 tabloda staj açan Anabilim Dalları ve kontenjanları belirtilmiş olup Ek 2’ deki tercih formunu doldurup 17 Temmuz 2026 mesai saati bitimine kadar koutip.ogrenciisleri@kocaeli.edu.tr mail adresine göndermeniz gerekmektedir. Not: 3 tercih hakkınız olup formu doldururken 1. 2. 3 . tercih olarak belirtmeniz gerekmektedir.",
    pdfUrl: "https://api.kocaeli.edu.tr/api/FileOperation/OpenFile?filePath=1019/Announcement/Files/2026/06/20260629_7dcd2_gonullu-yaz-staji-kontenjan-tablosu-ve-basvuru-formu-a9e.xlsx",
    imageUrl: null,
  },
  {
    id: "pa-live-5",
    day: "11",
    month: "MAY",
    dateIso: "2026-05-11",
    unit: "Tıp Fakültesi",
    title: "18.Mezuniyet Öncesi Tıp Eğitimi Çalıştay Programı",
    summary: "18.Mezuniyet Öncesi Tıp Eğitimi Çalıştay Programı",
    body: "18.Mezuniyet Öncesi Tıp Eğitimi Çalıştay Programı",
    pdfUrl: "https://api.kocaeli.edu.tr/api/FileOperation/OpenFile?filePath=1019/Announcement/Files/2026/05/20260511_56ce9_openfile-177.pdf",
    imageUrl: null,
  },
  {
    id: "pa-live-6",
    day: "07",
    month: "MAY",
    dateIso: "2026-05-07",
    unit: "Tıp Fakültesi",
    title: "Kütüphanemizde (Yaz Dönemi) Kısmi Zamanlı Çalışacak Öğrencilerin Alım İlanı ",
    summary: "Kütüphanemizde (Yaz Dönemi) Kısmi Zamanlı Çalışacak Öğrencilerin Alım İlanı",
    body: "Kütüphanemizde (Yaz Dönemi) Kısmi Zamanlı Çalışacak Öğrencilerin Alım İlanı",
    pdfUrl: "https://api.kocaeli.edu.tr/api/FileOperation/OpenFile?filePath=1019/Announcement/Files/2026/05/20260507_3278b_kutuphaneduyuru-7ae.pdf",
    imageUrl: null,
  },
  {
    id: "pa-live-7",
    day: "23",
    month: "MAR",
    dateIso: "2026-03-23",
    unit: "Tıp Fakültesi",
    title: "Tıpta Uzmanlık Projesi",
    summary: "Tıpta Uzmanlık Projesi",
    body: "Tıpta Uzmanlık Projesi",
    pdfUrl: null,
    imageUrl: "/assets/campus/duyurular/pa-7.jpg",
    sourceUrl: "https://tip.kocaeli.edu.tr/duyurular",
  },
  {
    id: "pa-live-8",
    day: "18",
    month: "MAR",
    dateIso: "2026-03-18",
    unit: "Tıp Fakültesi",
    title: "Endokrinoloji ve Metabolizma Bilim Dalı Akreditasyon Sürecinde Önemli Adım",
    summary: "Endokrinoloji ve Metabolizma Bilim Dalı Akreditasyon Sürecinde Önemli Adım",
    body: "Türkiye Endokrinoloji ve Metabolizma Derneği Endokrinoloji ve Metabolizma Hastalıkları Tıpta Uzmanlık Yeterlik Kurulu tarafından yürütülen akreditasyon süreci kapsamında, Kocaeli Üniversitesi Tıp Fakültesi Endokrinoloji ve Metabolizma Bilim Dalı değerlendirilecektir. Akreditasyon kurulu tarafından gerçekleştirilecek kurum ziyareti, 24 Mart 2026 tarihinde yapılacaktır.",
    pdfUrl: "https://api.kocaeli.edu.tr/api/FileOperation/OpenFile?filePath=1019/Announcement/Files/2026/03/20260318_6b73b_akr-a79.pdf",
    imageUrl: null,
  }
];

// ─────────────────────────────────────────────────────────
// KAMPÜS ETKİNLİKLERİ / SEMİNERLER
// ─────────────────────────────────────────────────────────
const campusEvents = [
  {
    id: "ev-live-1",
    day: "14",
    month: "EYL",
    dateIso: "2026-09-14",
    time: "12:00",
    organizer: "KOCAELİ ÜNİVERSİTESİ TIP FAKÜLTESİ",
    title: "Anatomi Eğitim ve Araştırma Laboratuvarı'nın Açılış Töreni",
    description: "Anatomi Eğitim ve Araştırma Laboratuvarı'nın Açılış Töreni",
    location: "Umuttepe · Tıp Fakültesi",
    speakerName: null,
    speakerTitle: null,
    accent: "emerald",
    imageUrl: "/assets/campus/etkinlikler/ev-1.jpg",
  },
  {
    id: "ev-live-2",
    day: "14",
    month: "EYL",
    dateIso: "2026-09-14",
    time: "09:30",
    organizer: "KOCAELİ ÜNİVERSİTESİ TIP FAKÜLTESİ",
    title: "2026-2027 Eğitim-Öğretim Yılı Beyaz Önlük Giyme Töreni",
    description: "2026-2027 Eğitim-Öğretim Yılı Beyaz Önlük Giyme Töreni",
    location: "Umuttepe · Tıp Fakültesi",
    speakerName: null,
    speakerTitle: null,
    accent: "violet",
    imageUrl: "/assets/campus/etkinlikler/ev-2.jpg",
  },
  {
    id: "ev-live-3",
    day: "11",
    month: "EYL",
    dateIso: "2026-09-11",
    time: "09:30",
    organizer: "KOCAELİ ÜNİVERSİTESİ TIP FAKÜLTESİ",
    title: "İletişim Becerileri Kursu",
    description: "İletişim Becerileri Kursu",
    location: "Umuttepe · Tıp Fakültesi",
    speakerName: null,
    speakerTitle: null,
    accent: "sky",
    imageUrl: "/assets/campus/etkinlikler/ev-3.jpg",
  },
  {
    id: "ev-live-4",
    day: "02",
    month: "TEM",
    dateIso: "2026-07-02",
    time: "00:00",
    organizer: "KOCAELİ ÜNİVERSİTESİ TIP FAKÜLTESİ",
    title: "Diyabetle Ortak Yaşam Aile Kampı",
    description: "Diyabetle Ortak Yaşam Aile Kampı",
    location: "Umuttepe · Tıp Fakültesi",
    speakerName: null,
    speakerTitle: null,
    accent: "amber",
    imageUrl: "/assets/campus/etkinlikler/ev-4.jpg",
  },
  {
    id: "ev-live-5",
    day: "01",
    month: "TEM",
    dateIso: "2026-07-01",
    time: "09:30",
    organizer: "KOCAELİ ÜNİVERSİTESİ TIP FAKÜLTESİ",
    title: "2026 - 2027 İntörn Uyum Program",
    description: "2026 - 2027 İntörn Uyum Program",
    location: "Umuttepe · Tıp Fakültesi",
    speakerName: null,
    speakerTitle: null,
    accent: "emerald",
    imageUrl: "/assets/campus/etkinlikler/ev-5.jpg",
  },
  {
    id: "ev-live-6",
    day: "18",
    month: "HAZ",
    dateIso: "2026-06-18",
    time: "13:30",
    organizer: "KOCAELİ ÜNİVERSİTESİ TIP FAKÜLTESİ",
    title: "Tıp Fakültesi Mezuniyet Töreni",
    description: "Tıp Fakültesi Mezuniyet Töreni",
    location: "Umuttepe · Tıp Fakültesi",
    speakerName: null,
    speakerTitle: null,
    accent: "violet",
    imageUrl: "/assets/campus/etkinlikler/ev-6.jpg",
  },
  {
    id: "ev-live-7",
    day: "09",
    month: "HAZ",
    dateIso: "2026-06-09",
    time: "12:30",
    organizer: "KOCAELİ ÜNİVERSİTESİ TIP FAKÜLTESİ",
    title: "Tıp Fakültesi Söyleşileri",
    description: "Tıp Fakültesi Söyleşileri",
    location: "Umuttepe · Tıp Fakültesi",
    speakerName: null,
    speakerTitle: null,
    accent: "sky",
    imageUrl: "/assets/campus/etkinlikler/ev-7.jpg",
  },
  {
    id: "ev-live-8",
    day: "03",
    month: "HAZ",
    dateIso: "2026-06-03",
    time: "12:30",
    organizer: "KOCAELİ ÜNİVERSİTESİ TIP FAKÜLTESİ",
    title: "Tıp Fakültesi Söyleşileri",
    description: "Tıp Fakültesi Söyleşileri",
    location: "Umuttepe · Tıp Fakültesi",
    speakerName: null,
    speakerTitle: null,
    accent: "amber",
    imageUrl: "/assets/campus/etkinlikler/ev-8.jpg",
  }
];

// ─────────────────────────────────────────────────────────
// HASTANE REHBERİ — Umuttepe blok / kat / birim
// ─────────────────────────────────────────────────────────
const hospitalPlaces = [
  {
    id: "hp-1",
    name: "Acil Triyaj",
    block: "Acil Blok",
    floor: "Zemin",
    category: "acil",
    hint: "Ana acil girişi · 7/24",
    tags: ["acil", "triyaj", "ambulans"],
  },
  {
    id: "hp-2",
    name: "Kardiyoloji Polikliniği",
    block: "B Blok",
    floor: "2. Kat",
    category: "poliklinik",
    hint: "Asansör B2 · Poliklinik koridoru",
    tags: ["kardiyoloji", "poliklinik"],
  },
  {
    id: "hp-3",
    name: "Pediatri Polikliniği",
    block: "C Blok",
    floor: "1. Kat",
    category: "poliklinik",
    hint: "Çocuk poliklinikleri girişi",
    tags: ["pediatri", "çocuk"],
  },
  {
    id: "hp-4",
    name: "Amfi 1",
    block: "Morfoloji",
    floor: "Zemin",
    category: "amfi",
    hint: "Ana amfi · 280 kişilik",
    tags: ["ders", "amfi", "morfoloji"],
  },
  {
    id: "hp-5",
    name: "Amfi 3",
    block: "Morfoloji",
    floor: "1. Kat",
    category: "amfi",
    hint: "Klinik vaka sunumları",
    tags: ["amfi", "vaka"],
  },
  {
    id: "hp-6",
    name: "Anatomi Laboratuvarı",
    block: "Morfoloji",
    floor: "Bodrum",
    category: "lab",
    hint: "Kadavra salonu · önlük zorunlu",
    tags: ["anatomi", "lab"],
  },
  {
    id: "hp-7",
    name: "Histoloji Laboratuvarı",
    block: "Morfoloji",
    floor: "1. Kat",
    category: "lab",
    hint: "Mikroskop salonu",
    tags: ["histoloji", "lab"],
  },
  {
    id: "hp-8",
    name: "Dekanlık",
    block: "İdari Blok",
    floor: "2. Kat",
    category: "idari",
    hint: "Öğrenci işleri aynı koridorda",
    tags: ["dekanlık", "idari"],
  },
  {
    id: "hp-9",
    name: "Öğrenci İşleri",
    block: "İdari Blok",
    floor: "1. Kat",
    category: "idari",
    hint: "Belge · mazeret · kayıt",
    tags: ["öğrenci işleri", "belge"],
  },
  {
    id: "hp-10",
    name: "Genel Cerrahi Servisi",
    block: "A Blok",
    floor: "4. Kat",
    category: "servis",
    hint: "Yatan hasta · intörn nöbet",
    tags: ["cerrahi", "servis"],
  },
  {
    id: "hp-11",
    name: "Dahiliye Servisi",
    block: "A Blok",
    floor: "3. Kat",
    category: "servis",
    hint: "Yatan hasta koridoru",
    tags: ["dahiliye", "servis"],
  },
  {
    id: "hp-12",
    name: "Konferans Salonu",
    block: "Morfoloji",
    floor: "2. Kat",
    category: "amfi",
    hint: "Söyleşi ve akademik toplantılar",
    tags: ["konferans", "söyleşi"],
  },
];

// ─────────────────────────────────────────────────────────
// AKADEMİK KADRO DİZİNİ (giriş öncesi)
// Kaynak: node scripts/scrape-tip-kadro.mjs → faculty-directory-live.json
// ─────────────────────────────────────────────────────────
const facultyDirectoryFallback = [
  {
    id: "fd-1",
    name: "Prof. Dr. Alparslan Kuş",
    title: "Prof. Dr.",
    department: "Dekanlık",
    office: "İdari Blok · 2. Kat",
    email: "dekan@kocaeli.edu.tr",
    phone: null,
    role: "dean",
  },
];

const facultyDirectoryLive = loadFacultyDirectoryLive();
const facultyDirectory =
  facultyDirectoryLive && facultyDirectoryLive.length > 0
    ? facultyDirectoryLive
    : facultyDirectoryFallback;

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

/**
 * Öne çıkanlar — canlı KOÜ API (tip.kocaeli.edu.tr → code 1019).
 * Kaynak: GET https://api.kocaeli.edu.tr/api/News/GetAll?TranslationCode=0&Count=6
 * Görseller: FileOperation?filePath=…  (2026-09 scrape)
 * docs/ONE-CIKANLAR.md
 */
const featuredItems = [
  {
    id: "news-1",
    remoteId: "a8ddb1b6-c93c-4e1a-3765-08df09a9d203",
    title: "Dikey Entegrasyon Çalışma Grubu Toplantısı",
    publishedAt: "2026-09-03",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/dikey-entegrasyon-calisma-grubu-toplantisi-4d3",
    source: "news",
    badge: "HABER",
    imagePath: "/featured/featured-1.jpg",
    summary: "Dikey Entegrasyon Çalışma Grubu Toplantısı",
    slug: "dikey-entegrasyon-calisma-grubu-toplantisi-4d3",
  },
  {
    id: "news-2",
    remoteId: "72c3b126-2811-47a5-1e42-08dee3184529",
    title: "KOÜ Kalplerimize Dokunuyor...",
    publishedAt: "2026-07-16",
    sourceUrl: "https://tip.kocaeli.edu.tr/haberler/kou-kalplerimize-dokunuyor-752",
    source: "news",
    badge: "HABER",
    imagePath: "/featured/featured-2.jpg",
    summary: "KOÜ Kalplerimize Dokunuyor...",
    slug: "kou-kalplerimize-dokunuyor-752",
  },
  {
    id: "news-3",
    remoteId: "7f1e9c8e-aac1-4029-f7d5-08dede5a5ed8",
    title:
      "Fakültemiz Öğretim Üyeleri Uluslararası FAIMER Enstitüsü (IFI) Programından Mezun Oldu",
    publishedAt: "2026-07-10",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/fakultemiz-ogretim-uyeleri-uluslararasi-faimer-enstitusu-ifi-programindan-mezun-oldu-450",
    source: "news",
    badge: "HABER",
    imagePath: "/featured/featured-3.png",
    summary:
      "Fakültemiz Öğretim Üyeleri Uluslararası FAIMER Enstitüsü (IFI) Programından Mezun Oldu",
    slug: "fakultemiz-ogretim-uyeleri-uluslararasi-faimer-enstitusu-ifi-programindan-mezun-oldu-450",
  },
  {
    id: "news-4",
    remoteId: "7ded27e8-7002-4b28-df96-08dedd9602d3",
    title: "Fakültemiz Çocuk Cerrahisi Anabilim Dalı Akreditasyon Onayı",
    publishedAt: "2026-07-09",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/fakultemiz-cocuk-cerrahisi-anabilim-dali-akreditasyon-onayi-035",
    source: "news",
    badge: "HABER",
    imagePath: "/featured/featured-4.jpg",
    summary: "Fakültemiz Çocuk Cerrahisi Anabilim Dalı Akreditasyon Onayı",
    slug: "fakultemiz-cocuk-cerrahisi-anabilim-dali-akreditasyon-onayi-035",
  },
  {
    id: "news-5",
    remoteId: "d10fbfc5-2f49-43bb-21d3-08dedc2619d7",
    title: "KOÜSİM Yönetim Kurulu Toplantısı Yapıldı",
    publishedAt: "2026-07-07",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/kousim-yonetim-kurulu-toplantisi-yapildi-fd3",
    source: "news",
    badge: "HABER",
    imagePath: "/featured/featured-5.jpg",
    summary: "KOÜSİM Yönetim Kurulu Toplantısı Yapıldı",
    slug: "kousim-yonetim-kurulu-toplantisi-yapildi-fd3",
  },
  {
    id: "news-6",
    remoteId: "2cfe6217-84d9-4f70-9ed2-08ded7574a95",
    title: "2026–2027 İntörn Uyum Programı Gerçekleştirildi",
    publishedAt: "2026-07-01",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/20262027-intorn-uyum-programi-gerceklestirildi-274",
    source: "news",
    badge: "HABER",
    imagePath: "/featured/featured-6.jpg",
    summary: "2026–2027 İntörn Uyum Programı Gerçekleştirildi",
    slug: "20262027-intorn-uyum-programi-gerceklestirildi-274",
  },
];

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
  portalAnnouncements,
  campusEvents,
  hospitalPlaces,
  facultyDirectory,
  grades,
  featuredItems,
};
