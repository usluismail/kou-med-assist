/** Domain types — UI ve mock API ortak sözleşmesi */

export type UserRole = "student" | "faculty";

export type LogRole = "observed" | "assisted" | "performed";
export type LogStatus = "pending" | "approved" | "revision_requested";
export type AgeGroup = "child" | "adult" | "geriatric";
export type Sex = "f" | "m" | "other";
export type ShiftState = "completed" | "upcoming" | "night";

/** Tüm kullanıcılarda ortak alanlar */
type BaseUser = {
  id: string;
  email: string;
  name: string;
  department: string;
  faculty: string;
  initials: string;
};

/** Öğrenci kullanıcısı — role discriminant ile */
export type StudentUser = BaseUser & {
  role: "student";
  studentNo: string;
  rotation: string;
  period: 1 | 2 | 3 | 4 | 5 | 6;
};

/** Akademisyen kullanıcısı — role discriminant ile */
export type FacultyUser = BaseUser & {
  role: "faculty";
};

/**
 * Discriminated union — tip-güvenli rol ayrımı.
 * Kullanım: `if (user.role === "student") { user.studentNo }` // TS hata vermez
 */
export type User = StudentUser | FacultyUser;


export type LoginResponse = {
  token: string;
  user: User;
};

export type ProcedureProgress = {
  id: string;
  name: string;
  done: number;
  total: number;
};

export type LogEntry = {
  id: string;
  encounterId: string;
  procedureId: string;
  procedureName: string;
  date: string;
  role: LogRole;
  supervisorId: string;
  supervisorName: string;
  status: LogStatus;
  studentId: string;
  ageGroup: AgeGroup;
  sex: Sex;
};

export type Shift = {
  id: string;
  day: number;
  label: string;
  time: string;
  area: string;
  state: ShiftState;
  partners: string[];
  studentId: string;
};

export type Supervisor = {
  id: string;
  name: string;
};

export type Colleague = {
  id: string;
  name: string;
};

export type PendingApproval = {
  id: string;
  encounterId: string;
  studentId: string;
  studentName: string;
  procedureName: string;
  submittedAt: string;
  studentPeriod?: number | null;
  studentRotation?: string;
};

export type StudentDashboard = {
  student: User;
  rotation: string;
  ucepProgress: { done: number; total: number; percent: number };
  upcomingShift: Shift | null;
  logSummary: { approved: number; pending: number; total: number };
};

export type ApprovalMethod = "push" | "qr";

export type CreateLogInput = {
  procedureId: string;
  encounterId: string;
  ageGroup: AgeGroup;
  sex: Sex;
  role: LogRole;
  supervisorId: string;
  approvalMethod: ApprovalMethod;
};

export type CreateLogResponse = LogEntry & {
  qrPayload: string | null;
};

export type SwapRequest = {
  id: string;
  shiftId: string;
  studentId: string;
  colleagueId: string;
  colleagueName: string;
  note: string | null;
  dutyHoursOk: boolean;
  createdAt: string;
  status: string;
};

export type OsceStationProgress = {
  id: string;
  title: string;
  status: "done" | "pending";
  score: number | null;
  subtitle: string;
};

export type OsceSession = {
  id: string;
  title: string;
  date: string;
  time: string;
  status: string;
  stationCount: number;
  department?: string | null;
  stations: OsceStationProgress[];
};

export type OsceChecklistOption = {
  id?: string;
  value?: string;
  label: string;
  points: number;
};

export type OsceChecklistItem = {
  id: string;
  prompt: string;
  type: "tri" | "likert";
  options?: OsceChecklistOption[];
  min?: number;
  max?: number;
};

export type OsceCandidate = {
  id: string;
  name: string;
  code: string;
  initials: string;
  period?: string;
  group: string;
};

export type OsceStation = {
  id: string;
  sessionId: string;
  number: number;
  title: string;
  durationSec: number;
  candidate: OsceCandidate;
  checklist: OsceChecklistItem[];
  globalDefault: number;
};

export type OsceScoreInput = {
  sessionId: string;
  stationId: string;
  candidateId: string;
  checklist: Record<string, string | number>;
  globalScore: number;
  offlineSyncedAt?: string | null;
};

export type OsceScore = OsceScoreInput & {
  id: string;
  scoredBy: string;
  createdAt: string;
};

export type ApiErrorBody = {
  error?: string;
  message?: string;
  status?: string;
};

// ─────────────────────────────────────────────────────────
// DÖNEM BİLGİSİ
// ─────────────────────────────────────────────────────────
export type StudentPeriod = 1 | 2 | 3 | 4 | 5 | 6;

// ─────────────────────────────────────────────────────────
// DANIŞMAN HOCA (Dönem 1-3)
// ─────────────────────────────────────────────────────────
export type Advisor = {
  id: string;
  name: string;
  title: string;
  department: string;
  office: string;
  officeHours: string;
  email: string;
  phone?: string;
  photoUrl: string | null;
};

// ─────────────────────────────────────────────────────────
// DERS PROGRAMI (Dönem 1-3: Pre-Klinik)
// ─────────────────────────────────────────────────────────
export type LessonDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
export type LessonType = "lecture" | "lab" | "exam";

export type Lesson = {
  day: LessonDay;
  time: string;
  endTime: string;
  subject: string;
  room: string;
  instructorId: string;
  instructorName: string;
  type: LessonType;
};

// ─────────────────────────────────────────────────────────
// YEMEKHANESİ
// ─────────────────────────────────────────────────────────
export type MenuItem = {
  name: string;
  calories: number;
  allergens?: string[];
};

export type CafeteriaMenu = {
  date: string;
  meals: {
    breakfast: MenuItem[];
    lunch: MenuItem[];
    dinner: MenuItem[];
  };
};

// ─────────────────────────────────────────────────────────
// STAJ BLOĞU (Dönem 4-5)
// ─────────────────────────────────────────────────────────
export type InternshipBlock = {
  name: string;
  week: number;
  rotation: string;
  supervisorId: string;
  supervisorName: string;
  startDate: string;
  endDate: string;
};

// ─────────────────────────────────────────────────────────
// KLİNİK STAJ TAKVİMİ (Dönem 4-5)
// ─────────────────────────────────────────────────────────
export type ClinicalSessionType = "theoretical" | "practical";

export type ClinicalSession = {
  type: ClinicalSessionType;
  time: string;
  endTime: string;
  subject: string;
  location: string;
  instructorId: string;
  instructorName: string;
  attendanceRequired: boolean;
  attendanceVerified: boolean;
};

export type ClinicalScheduleDay = {
  id: string;
  date: string;
  morning: ClinicalSession;
  afternoon: ClinicalSession;
};

// ─────────────────────────────────────────────────────────
// E-KARNE (Dönem 6: İntörn)
// ─────────────────────────────────────────────────────────
export type InternshipStatus = "completed" | "pending" | "not_started";
export type SignatureStatus = "signed" | "pending";

export type InternshipRecord = {
  name: string;
  status: InternshipStatus;
  completedAt: string | null;
  supervisorId: string;
  supervisorName: string;
  signatureStatus: SignatureStatus;
};

export type EKarne = {
  studentId: string;
  completionRate: number;
  internships: InternshipRecord[];
  procedureStats: {
    total: number;
    completed: number;
    pending: number;
  };
  pdfGeneratedAt: string | null;
  pdfUrl: string | null;
  generatedAt: string;
};

export type StudentGrades = {
  period: number;
  gpa: number;
  committees: {
    id: string;
    name: string;
    status: "completed" | "ongoing" | "future";
    courses: {
      name: string;
      score: number | null;
      letterGrade: string | null;
      passed: boolean | null;
    }[];
  }[];
};

export type PdfGenerateResponse = {
  ok: boolean;
  pdfUrl: string;
  generatedAt: string;
  message: string;
};


// ─────────────────────────────────────────────────────────
// İLETİŞİM MERKEZİ
// ─────────────────────────────────────────────────────────
export type MessageRecipientType = "student_affairs" | "advisor" | "internship_supervisor";
export type MessageCategory = "grade_objection" | "excuse" | "internship_change" | "advising" | "general";
export type MessageStatus = "sent" | "delivered" | "replied";

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderStudentNo: string;
  senderPeriod: number | null;
  senderRotation: string;
  recipientType: MessageRecipientType;
  recipientLabel: string;
  category: MessageCategory;
  categoryLabel: string;
  subject: string;
  body: string;
  attachments: string[];
  sentAt: string;
  status: MessageStatus;
};

export type SendMessageInput = {
  recipientType: MessageRecipientType;
  category: MessageCategory;
  body: string;
  attachments?: string[];
};

// ─────────────────────────────────────────────────────────
// DUYURULAR
// ─────────────────────────────────────────────────────────
export type AnnouncementActionType = "cancelled" | "time_changed" | "room_changed" | "general";
export type AnnouncementChannel = "push" | "email" | "in_app";

export type AnnouncementTarget = {
  type: "period_committee" | "internship_group" | "all_interns" | "specific_group";
  period?: number;
  group?: string;
};

export type Announcement = {
  id: string;
  authorId: string;
  authorName: string;
  targetAudience: AnnouncementTarget[];
  actionType: AnnouncementActionType;
  title: string;
  body: string;
  originalLesson: string | null;
  sentAt: string;
  channels: AnnouncementChannel[];
  isRead: boolean;
  reachedCount?: number;
};

export type CreateAnnouncementInput = {
  targetAudience: AnnouncementTarget | AnnouncementTarget[];
  actionType: AnnouncementActionType;
  title: string;
  body: string;
  originalLesson?: string;
  channels?: AnnouncementChannel[];
};

// ─────────────────────────────────────────────────────────
// PORTAL (giriş öncesi) — Duyuru & Etkinlik
// ─────────────────────────────────────────────────────────
export type PortalAnnouncementCategory = "klinik" | "akademik" | "fakulte" | "staj";

export type PortalAnnouncement = {
  id: string;
  day: string;
  month: string;
  dateIso: string;
  unit: string;
  category: PortalAnnouncementCategory;
  title: string;
  summary: string;
  body: string;
  pdfUrl: string | null;
};

export type CampusEvent = {
  id: string;
  day: string;
  month: string;
  dateIso: string;
  time: string;
  organizer: string;
  title: string;
  description: string;
  location: string;
  speakerName: string | null;
  speakerTitle: string | null;
  accent: "emerald" | "violet" | "sky" | "amber";
};

// ─────────────────────────────────────────────────────────
// PORTAL — Hastane rehberi & akademik kadro
// ─────────────────────────────────────────────────────────
export type HospitalPlaceCategory =
  | "poliklinik"
  | "amfi"
  | "acil"
  | "lab"
  | "idari"
  | "servis";

export type HospitalPlace = {
  id: string;
  name: string;
  block: string;
  floor: string;
  category: HospitalPlaceCategory;
  hint: string;
  tags: string[];
};

export type FacultyStaffMember = {
  id: string;
  name: string;
  title: string;
  department: string;
  office: string | null;
  email: string | null;
  phone: string | null;
  role: "dean" | "chair" | "faculty" | "advisor";
};

// ─────────────────────────────────────────────────────────
// PORTAL — Öne çıkanlar (haber vitrini)
// ─────────────────────────────────────────────────────────
export type FeaturedSource =
  | "news"
  | "event"
  | "announcement"
  | "editorial"
  | "fallback";

export type FeaturedItem = {
  id: string;
  title: string;
  publishedAt: string;
  imageUrl: string | null;
  sourceUrl: string | null;
  source: FeaturedSource;
  badge: string;
  summary: string | null;
};

