/**
 * nav.test.ts — Navigasyon yardımcı fonksiyon testleri.
 *
 * Saf fonksiyon testleri — hiçbir RN veya Expo bağımlılığı yok.
 * studentArea ve studentHomeHref fonksiyonları API'den tamamen bağımsız.
 */
import { studentArea, studentHomeHref, ROLE_HOME_HREF } from "@/lib/nav";
import type { StudentUser, FacultyUser } from "@/lib/api/types";

// ─── studentArea ──────────────────────────────────────────────────────────────

describe("studentArea", () => {
  it("dönem 1 → pre-klinik", () => expect(studentArea(1)).toBe("pre-klinik"));
  it("dönem 2 → pre-klinik", () => expect(studentArea(2)).toBe("pre-klinik"));
  it("dönem 3 → pre-klinik", () => expect(studentArea(3)).toBe("pre-klinik"));
  it("dönem 4 → klinik",     () => expect(studentArea(4)).toBe("klinik"));
  it("dönem 5 → klinik",     () => expect(studentArea(5)).toBe("klinik"));
  it("dönem 6 → intorn",     () => expect(studentArea(6)).toBe("intorn"));
  it("null → intorn (fallback)",      () => expect(studentArea(null)).toBe("intorn"));
  it("undefined → intorn (fallback)", () => expect(studentArea(undefined)).toBe("intorn"));
  it("0 → intorn (geçersiz dönem)",   () => expect(studentArea(0)).toBe("intorn"));
  it("7 → intorn (geçersiz dönem)",   () => expect(studentArea(7)).toBe("intorn"));
  it("-1 → intorn (negatif dönem)",   () => expect(studentArea(-1)).toBe("intorn"));
});

// ─── studentHomeHref ──────────────────────────────────────────────────────────

describe("studentHomeHref", () => {
  it("dönem 1 → '/ogrenci/pre-klinik'", () =>
    expect(studentHomeHref(1)).toBe("/ogrenci/pre-klinik"));

  it("dönem 4 → '/ogrenci/klinik'", () =>
    expect(studentHomeHref(4)).toBe("/ogrenci/klinik"));

  it("dönem 6 → '/ogrenci/intorn'", () =>
    expect(studentHomeHref(6)).toBe("/ogrenci/intorn"));

  it("null → '/ogrenci/intorn'", () =>
    expect(studentHomeHref(null)).toBe("/ogrenci/intorn"));
});

// ─── ROLE_HOME_HREF ───────────────────────────────────────────────────────────

describe("ROLE_HOME_HREF", () => {
  const baseUser = {
    id: "u1",
    email: "test@kocaeli.edu.tr",
    name: "Test Kullanıcı",
    department: "Dahiliye",
    faculty: "Tıp Fakültesi",
    initials: "TK",
  };

  const studentUser: StudentUser = {
    ...baseUser,
    role: "student",
    studentNo: "190101001",
    rotation: "Kardiyoloji",
    period: 3,
  };

  const facultyUser: FacultyUser = {
    ...baseUser,
    role: "faculty",
  };

  it("öğrenci → dönemine göre doğru href döner", () => {
    expect(ROLE_HOME_HREF["student"](studentUser)).toBe("/ogrenci/pre-klinik");
  });

  it("dönem 5 öğrenci → '/ogrenci/klinik'", () => {
    const klinikStudent: StudentUser = { ...studentUser, period: 5 };
    expect(ROLE_HOME_HREF["student"](klinikStudent)).toBe("/ogrenci/klinik");
  });

  it("dönem 6 öğrenci → '/ogrenci/intorn'", () => {
    const internStudent: StudentUser = { ...studentUser, period: 6 };
    expect(ROLE_HOME_HREF["student"](internStudent)).toBe("/ogrenci/intorn");
  });

  it("akademisyen → '/akademisyen'", () => {
    expect(ROLE_HOME_HREF["faculty"](facultyUser)).toBe("/akademisyen");
  });

  it("bilinmeyen rol → undefined (OCP: yeni rol eklenmeden önce)", () => {
    expect(ROLE_HOME_HREF["unknown_role"]).toBeUndefined();
  });
});
