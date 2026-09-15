/**
 * adapters.test.ts — Backend ↔ UI dönüşüm testleri.
 *
 * Bu testler API'den tamamen bağımsız — saf fonksiyon testleri.
 * Real API gelince bu testler değişmez; sadece adapter fonksiyonları güncellenir.
 */
import {
  adaptIdentity,
  adaptLegacyOsceSession,
  adaptOsceStation,
  type LegacyOsceSessionPayload,
} from "@/lib/api/adapters";
import type { OsceStation } from "@/lib/api/types";

// ─── adaptIdentity ─────────────────────────────────────────────────────────────

describe("adaptIdentity", () => {
  it("aynı nesneyi geri döndürür", () => {
    const obj = { id: "1", name: "test" };
    expect(adaptIdentity(obj)).toBe(obj);
  });

  it("primitive değerleri değiştirmez", () => {
    expect(adaptIdentity(42)).toBe(42);
    expect(adaptIdentity("hello")).toBe("hello");
    expect(adaptIdentity(null)).toBeNull();
  });
});

// ─── adaptLegacyOsceSession ───────────────────────────────────────────────────

describe("adaptLegacyOsceSession", () => {
  const minimalPayload: LegacyOsceSessionPayload = {
    exam_id: "exam-001",
    exam_name: "Dahiliye OSCE",
    exam_date: "2026-10-15",
  };

  it("zorunlu alanları doğru map'ler", () => {
    const result = adaptLegacyOsceSession(minimalPayload);
    expect(result.id).toBe("exam-001");
    expect(result.title).toBe("Dahiliye OSCE");
    expect(result.date).toBe("2026-10-15");
  });

  it("opsiyonel time alanı yoksa varsayılan '09:00' kullanır", () => {
    const result = adaptLegacyOsceSession(minimalPayload);
    expect(result.time).toBe("09:00");
  });

  it("time alanı varsa onu kullanır", () => {
    const result = adaptLegacyOsceSession({ ...minimalPayload, exam_time: "14:30" });
    expect(result.time).toBe("14:30");
  });

  it("status yoksa 'upcoming' döner", () => {
    const result = adaptLegacyOsceSession(minimalPayload);
    expect(result.status).toBe("upcoming");
  });

  it("status varsa onu kullanır", () => {
    const result = adaptLegacyOsceSession({ ...minimalPayload, exam_status: "completed" });
    expect(result.status).toBe("completed");
  });

  it("department (dept) alanını map'ler", () => {
    const result = adaptLegacyOsceSession({ ...minimalPayload, dept: "Kardiyoloji" });
    expect(result.department).toBe("Kardiyoloji");
  });

  it("dept yoksa department null olur", () => {
    const result = adaptLegacyOsceSession(minimalPayload);
    expect(result.department).toBeNull();
  });

  it("boş station_list ile stationCount 0 olur", () => {
    const result = adaptLegacyOsceSession({ ...minimalPayload, station_list: [] });
    expect(result.stationCount).toBe(0);
    expect(result.stations).toHaveLength(0);
  });

  it("station_list tamamlanmışsa status 'done' olur", () => {
    const result = adaptLegacyOsceSession({
      ...minimalPayload,
      station_list: [{ station_id: "s1", station_title: "İstasyon 1", completed: true, percent: 85 }],
    });
    expect(result.stations[0].status).toBe("done");
    expect(result.stations[0].score).toBe(85);
  });

  it("station tamamlanmamışsa status 'pending' olur", () => {
    const result = adaptLegacyOsceSession({
      ...minimalPayload,
      station_list: [{ station_id: "s2", station_title: "İstasyon 2", completed: false }],
    });
    expect(result.stations[0].status).toBe("pending");
    expect(result.stations[0].score).toBeNull();
  });

  it("station note varsa subtitle olarak kullanılır", () => {
    const result = adaptLegacyOsceSession({
      ...minimalPayload,
      station_list: [{ station_id: "s3", station_title: "Test", note: "Özel not" }],
    });
    expect(result.stations[0].subtitle).toBe("Özel not");
  });

  it("station note yoksa fallback subtitle üretir", () => {
    const result = adaptLegacyOsceSession({
      ...minimalPayload,
      station_list: [{ station_id: "s4", station_title: "Test", completed: true }],
    });
    expect(result.stations[0].subtitle).toBe("Pratik tamamlandı");
  });

  it("stationCount station_list uzunluğuyla eşleşir", () => {
    const result = adaptLegacyOsceSession({
      ...minimalPayload,
      station_list: [
        { station_id: "s1", station_title: "A" },
        { station_id: "s2", station_title: "B" },
        { station_id: "s3", station_title: "C" },
      ],
    });
    expect(result.stationCount).toBe(3);
    expect(result.stations).toHaveLength(3);
  });
});

// ─── adaptOsceStation ─────────────────────────────────────────────────────────

describe("adaptOsceStation", () => {
  const baseStation: OsceStation = {
    id: "st-001",
    sessionId: "sess-001",
    number: 1,
    title: "Muayene İstasyonu",
    durationSec: 300,
    globalDefault: 0, // sıfır → fallback 65 bekleniyor
    candidate: {
      id: "cand-001",
      name: "Ali Veli",
      code: "AV001",
      initials: "AV",
      group: "Grup A · 5. Dönem",
    },
    checklist: [],
  };

  it("globalDefault 0 ise fallback 65 döner", () => {
    const result = adaptOsceStation(baseStation);
    expect(result.globalDefault).toBe(65);
  });

  it("globalDefault 0 değilse korunur", () => {
    const result = adaptOsceStation({ ...baseStation, globalDefault: 70 });
    expect(result.globalDefault).toBe(70);
  });

  it("candidate.period yoksa group'tan çıkarılır", () => {
    const result = adaptOsceStation(baseStation);
    // group: "Grup A · 5. Dönem" → split("·")[0].trim() = "Grup A"
    expect(result.candidate.period).toBe("Grup A");
  });

  it("candidate.period varsa korunur", () => {
    const result = adaptOsceStation({
      ...baseStation,
      candidate: { ...baseStation.candidate, period: "Dönem 5" },
    });
    expect(result.candidate.period).toBe("Dönem 5");
  });

  it("checklist option id eksikse value veya label kullanılır", () => {
    const result = adaptOsceStation({
      ...baseStation,
      checklist: [{
        id: "item-1",
        prompt: "Soru 1",
        type: "tri",
        options: [
          { label: "Evet", points: 2, value: "yes" },        // id yok → value kullanılır
          { label: "Hayır", points: 0 },                      // id ve value yok → label kullanılır
        ],
      }],
    });
    expect(result.checklist[0].options![0].id).toBe("yes");
    expect(result.checklist[0].options![1].id).toBe("Hayır");
  });

  it("checklist option value eksikse id kullanılır", () => {
    const result = adaptOsceStation({
      ...baseStation,
      checklist: [{
        id: "item-2",
        prompt: "Soru 2",
        type: "tri",
        options: [
          { label: "Kısmi", points: 1, id: "partial" }, // value yok → id kullanılır
        ],
      }],
    });
    expect(result.checklist[0].options![0].value).toBe("partial");
  });

  it("boş checklist'i sorunsuz işler", () => {
    const result = adaptOsceStation({ ...baseStation, checklist: [] });
    expect(result.checklist).toHaveLength(0);
  });
});
