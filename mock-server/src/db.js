const seed = require("./seed");

/** Bellekte tutulan veri — yeniden başlatınca seed’e döner */
function createDb() {
  return {
    // ── Kullanıcılar & rol verileri ──
    users: structuredClone(seed.users),
    supervisors: structuredClone(seed.supervisors),
    advisors: structuredClone(seed.advisors || []),
    colleagues: structuredClone(seed.colleagues),

    // ── Pre-klinik (Dönem 1-3) ──
    preKlinikSchedule: structuredClone(seed.preKlinikSchedule || {}),
    cafeteriaMenus: structuredClone(seed.cafeteriaMenus || []),

    // ── Klinik staj (Dönem 4-5) ──
    clinicalSchedule: structuredClone(seed.clinicalSchedule || {}),

    // ── İntörn (Dönem 6) ──
    eKarne: structuredClone(seed.eKarne || {}),
    grades: structuredClone(seed.grades || {}),
    procedures: structuredClone(seed.procedures),
    proceduresByStudent: structuredClone(seed.proceduresByStudent || {}),
    logs: structuredClone(seed.logs),
    shifts: structuredClone(seed.shifts),
    pendingApprovals: structuredClone(seed.pendingApprovals),

    // ── İletişim ──
    messages: structuredClone(seed.messages || []),
    announcements: structuredClone(seed.announcements || []),
    portalAnnouncements: structuredClone(seed.portalAnnouncements || []),
    campusEvents: structuredClone(seed.campusEvents || []),
    hospitalPlaces: structuredClone(seed.hospitalPlaces || []),
    facultyDirectory: structuredClone(seed.facultyDirectory || []),
    featuredItems: structuredClone(seed.featuredItems || []),

    // ── OSCE ──
    osceSessions: structuredClone(seed.osceSessions),
    osceStations: structuredClone(seed.osceStations),
    studentOsceProgress: structuredClone(seed.studentOsceProgress || {}),
    osceScores: [],

    // ── Oturum / QR ──
    /** token → userId */
    sessions: new Map(),
    /** qrPayload → logId */
    qrTokens: new Map(),
    swapRequests: [],
  };
}

module.exports = { createDb };
