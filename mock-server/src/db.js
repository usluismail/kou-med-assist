const seed = require("./seed");

/** Bellekte tutulan veri — yeniden başlatınca seed’e döner */
function createDb() {
  return {
    users: structuredClone(seed.users),
    supervisors: structuredClone(seed.supervisors),
    procedures: structuredClone(seed.procedures),
    logs: structuredClone(seed.logs),
    shifts: structuredClone(seed.shifts),
    pendingApprovals: structuredClone(seed.pendingApprovals),
    colleagues: structuredClone(seed.colleagues),
    osceSessions: structuredClone(seed.osceSessions),
    osceStations: structuredClone(seed.osceStations),
    studentOsceProgress: structuredClone(seed.studentOsceProgress || {}),
    osceScores: [],
    /** token → userId */
    sessions: new Map(),
    /** qrPayload → logId */
    qrTokens: new Map(),
    swapRequests: [],
  };
}

module.exports = { createDb };
