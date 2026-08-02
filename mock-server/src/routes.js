const express = require("express");
const crypto = require("crypto");
const { publicUser, createToken, authMiddleware, requireRole } = require("./auth");

const FORBIDDEN_PII = [
  "patientName",
  "hastaAdi",
  "tcKimlik",
  "tckn",
  "nationalId",
  "birthDate",
  "dogumTarihi",
];

function assertNoPii(body, res) {
  const keys = Object.keys(body || {});
  const hit = keys.find((k) =>
    FORBIDDEN_PII.some((f) => f.toLowerCase() === k.toLowerCase())
  );
  if (hit) {
    res.status(422).json({
      error: "KVKK",
      message: `Kişisel hasta verisi kabul edilmez: ${hit}`,
    });
    return false;
  }
  return true;
}

function createRoutes(db) {
  const router = express.Router();
  const auth = authMiddleware(db);

  if (!db.qrTokens) db.qrTokens = new Map();
  if (!db.swapRequests) db.swapRequests = [];

  // —— Health ——
  router.get("/health", (_req, res) => {
    res.json({ ok: true, service: "kou-med-mock-server", time: new Date().toISOString() });
  });

  // —— Auth ——
  router.post("/auth/login", (req, res) => {
    const { email, password, role } = req.body || {};
    if (!email || !password) {
      return res.status(422).json({
        error: "Validation",
        message: "email (veya öğrenci no) ve password gerekli",
      });
    }
    const id = String(email).trim();
    const idLower = id.toLowerCase();
    const user = db.users.find(
      (u) =>
        (u.email.toLowerCase() === idLower || u.studentNo === id) &&
        u.password === password &&
        (!role || u.role === role)
    );
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "E-posta / öğrenci no veya şifre hatalı",
      });
    }
    const token = createToken(user.id);
    db.sessions.set(token, user.id);
    res.json({ token, user: publicUser(user) });
  });

  router.get("/auth/me", auth, (req, res) => {
    res.json(publicUser(req.user));
  });

  // —— Student read ——
  router.get("/student/dashboard", auth, requireRole("student"), (req, res) => {
    const student = publicUser(req.user);
    const approved = db.logs.filter(
      (l) => l.studentId === req.user.id && l.status === "approved"
    ).length;
    const pending = db.logs.filter(
      (l) => l.studentId === req.user.id && l.status === "pending"
    ).length;
    const upcomingShift =
      db.shifts.find((s) => s.studentId === req.user.id && s.state === "upcoming") ||
      db.shifts.find((s) => s.studentId === req.user.id && s.state === "night") ||
      null;
    const done = db.procedures.reduce((sum, p) => sum + p.done, 0);
    const total = db.procedures.reduce((sum, p) => sum + p.total, 0);

    res.json({
      student,
      rotation: req.user.rotation,
      ucepProgress: { done, total, percent: total ? Math.round((done / total) * 100) : 0 },
      upcomingShift,
      logSummary: { approved, pending, total: approved + pending },
    });
  });

  router.get("/student/procedures", auth, requireRole("student"), (_req, res) => {
    res.json(db.procedures);
  });

  router.get("/student/logs", auth, requireRole("student"), (req, res) => {
    const items = db.logs
      .filter((l) => l.studentId === req.user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(items);
  });

  router.get("/student/shifts", auth, requireRole("student"), (req, res) => {
    const items = db.shifts.filter((s) => s.studentId === req.user.id);
    res.json(items);
  });

  router.get("/student/supervisors", auth, requireRole("student"), (_req, res) => {
    res.json(db.supervisors);
  });

  router.get("/student/colleagues", auth, requireRole("student"), (_req, res) => {
    res.json(db.colleagues);
  });

  // —— Student write (Sprint B) ——
  router.post("/student/logs", auth, requireRole("student"), (req, res) => {
    const body = req.body || {};
    if (!assertNoPii(body, res)) return;

    const {
      procedureId,
      encounterId,
      ageGroup,
      sex,
      role,
      supervisorId,
      approvalMethod,
    } = body;

    if (!procedureId || !encounterId || !ageGroup || !sex || !role || !supervisorId) {
      return res.status(422).json({
        error: "Validation",
        message:
          "procedureId, encounterId, ageGroup, sex, role, supervisorId zorunlu",
      });
    }
    if (!["observed", "assisted", "performed"].includes(role)) {
      return res.status(422).json({ error: "Validation", message: "Geçersiz role" });
    }
    if (!["child", "adult", "geriatric"].includes(ageGroup)) {
      return res.status(422).json({ error: "Validation", message: "Geçersiz ageGroup" });
    }
    if (!["f", "m", "other"].includes(sex)) {
      return res.status(422).json({ error: "Validation", message: "Geçersiz sex" });
    }
    const method = approvalMethod === "qr" ? "qr" : "push";

    const procedure = db.procedures.find((p) => p.id === procedureId);
    if (!procedure) {
      return res.status(404).json({ error: "Not Found", message: "Prosedür bulunamadı" });
    }
    const supervisor = db.supervisors.find((s) => s.id === supervisorId);
    if (!supervisor) {
      return res.status(404).json({ error: "Not Found", message: "Eğitici bulunamadı" });
    }

    const id = `log-${crypto.randomBytes(4).toString("hex")}`;
    const now = new Date().toISOString();
    const entry = {
      id,
      encounterId: String(encounterId).trim(),
      procedureId,
      procedureName: procedure.name,
      date: now,
      role,
      supervisorId,
      supervisorName: supervisor.name,
      status: "pending",
      studentId: req.user.id,
      ageGroup,
      sex,
      approvalMethod: method,
    };

    db.logs.unshift(entry);
    db.pendingApprovals.unshift({
      id,
      encounterId: entry.encounterId,
      studentId: req.user.id,
      studentName: req.user.name,
      procedureName: entry.procedureName,
      submittedAt: now,
    });

    let qrPayload = null;
    if (method === "qr") {
      qrPayload = `QR-${id}-${Date.now()}`;
      db.qrTokens.set(qrPayload, id);
    }

    res.status(201).json({ ...entry, qrPayload });
  });

  router.post(
    "/student/shifts/:id/swap-request",
    auth,
    requireRole("student"),
    (req, res) => {
      const shift = db.shifts.find(
        (s) => s.id === req.params.id && s.studentId === req.user.id
      );
      if (!shift) {
        return res.status(404).json({ error: "Not Found", message: "Nöbet bulunamadı" });
      }
      const { colleagueId, note } = req.body || {};
      if (!colleagueId) {
        return res.status(422).json({
          error: "Validation",
          message: "colleagueId gerekli",
        });
      }
      const colleague = db.colleagues.find((c) => c.id === colleagueId);
      if (!colleague) {
        return res.status(404).json({ error: "Not Found", message: "Arkadaş bulunamadı" });
      }

      const request = {
        id: `swap-${crypto.randomBytes(3).toString("hex")}`,
        shiftId: shift.id,
        studentId: req.user.id,
        colleagueId,
        colleagueName: colleague.name,
        note: note || null,
        dutyHoursOk: true,
        createdAt: new Date().toISOString(),
        status: "pending",
      };
      db.swapRequests.push(request);
      res.status(201).json(request);
    }
  );

  // —— Faculty ——
  router.get("/faculty/approvals/pending", auth, requireRole("faculty"), (_req, res) => {
    res.json(db.pendingApprovals);
  });

  router.post(
    "/faculty/approvals/:id/approve",
    auth,
    requireRole("faculty"),
    (req, res) => {
      const { note, voiceNoteUrl } = req.body || {};
      const pendingIdx = db.pendingApprovals.findIndex((p) => p.id === req.params.id);
      const log = db.logs.find((l) => l.id === req.params.id);
      if (!log && pendingIdx < 0) {
        return res.status(404).json({ error: "Not Found", message: "Kayıt bulunamadı" });
      }
      if (log) {
        log.status = "approved";
        log.approvalNote = note || null;
        log.voiceNoteUrl = voiceNoteUrl || null;
        log.approvedAt = new Date().toISOString();
        log.approvedBy = req.user.id;
        const proc = db.procedures.find((p) => p.id === log.procedureId);
        if (proc && proc.done < proc.total) proc.done += 1;
      }
      if (pendingIdx >= 0) db.pendingApprovals.splice(pendingIdx, 1);
      res.json(log || { id: req.params.id, status: "approved" });
    }
  );

  router.post(
    "/faculty/approvals/:id/request-revision",
    auth,
    requireRole("faculty"),
    (req, res) => {
      const { note } = req.body || {};
      if (!note || !String(note).trim()) {
        return res.status(422).json({
          error: "Validation",
          message: "Düzeltme notu (note) zorunlu",
        });
      }
      const pendingIdx = db.pendingApprovals.findIndex((p) => p.id === req.params.id);
      const log = db.logs.find((l) => l.id === req.params.id);
      if (!log && pendingIdx < 0) {
        return res.status(404).json({ error: "Not Found", message: "Kayıt bulunamadı" });
      }
      if (log) {
        log.status = "revision_requested";
        log.revisionNote = String(note).trim();
      }
      if (pendingIdx >= 0) db.pendingApprovals.splice(pendingIdx, 1);
      res.json(log || { id: req.params.id, status: "revision_requested" });
    }
  );

  router.post("/faculty/approvals/qr", auth, requireRole("faculty"), (req, res) => {
    const { qrPayload } = req.body || {};
    if (!qrPayload) {
      return res.status(422).json({ error: "Validation", message: "qrPayload gerekli" });
    }
    const logId = db.qrTokens.get(String(qrPayload));
    if (!logId) {
      return res.status(400).json({ status: "invalid", message: "QR geçersiz veya süresi dolmuş" });
    }
    const log = db.logs.find((l) => l.id === logId);
    const pending = db.pendingApprovals.find((p) => p.id === logId);
    if (!log || log.status !== "pending") {
      return res.status(400).json({ status: "invalid", message: "Kayıt onaylanamaz durumda" });
    }
    res.json(
      pending || {
        id: log.id,
        encounterId: log.encounterId,
        studentId: log.studentId,
        studentName: db.users.find((u) => u.id === log.studentId)?.name ?? "—",
        procedureName: log.procedureName,
        submittedAt: log.date,
      }
    );
  });

  // —— OSCE (Sprint C) ——
  router.get("/student/osce/sessions", auth, requireRole("student"), (req, res) => {
    const progressRoot = db.studentOsceProgress?.[req.user.id] || {};
    const enriched = db.osceSessions.map((session) => {
      const prog = progressRoot[session.id] || {};
      const stations = db.osceStations
        .filter((s) => s.sessionId === session.id)
        .map((s) => {
          const p = prog[s.id] || { status: "pending", scorePct: null };
          const done = p.status === "completed" || p.status === "done";
          return {
            id: s.id,
            title: `İstasyon ${s.number}: ${s.title}`,
            status: done ? "done" : "pending",
            score: p.scorePct,
            subtitle: done ? "Pratik tamamlandı" : "Deneme bekliyor",
          };
        });
      return {
        id: session.id,
        title: session.title,
        date: session.date,
        time: session.time || "09:00",
        status: session.status,
        stationCount: stations.length || session.stationCount,
        department: session.department || null,
        stations,
      };
    });
    res.json(enriched);
  });

  router.get(
    "/faculty/osce/stations/:stationId",
    auth,
    requireRole("faculty"),
    (req, res) => {
      const station = db.osceStations.find((s) => s.id === req.params.stationId);
      if (!station) {
        return res.status(404).json({
          error: "Not Found",
          message: "İstasyon bulunamadı",
        });
      }
      res.json({
        ...station,
        globalDefault: station.globalDefault ?? 65,
        candidate: station.candidate || {
          id: "cand-unknown",
          name: "Aday",
          code: "—",
          initials: "—",
          period: "Dönem 6",
          group: "Grup A",
        },
        checklist: station.checklist || [],
      });
    }
  );

  router.post("/faculty/osce/scores", auth, requireRole("faculty"), (req, res) => {
    const body = req.body || {};
    const {
      sessionId,
      stationId,
      candidateId,
      checklist,
      globalScore,
      offlineSyncedAt,
    } = body;
    if (!sessionId || !stationId || !candidateId || globalScore == null) {
      return res.status(422).json({
        error: "Validation",
        message: "sessionId, stationId, candidateId, globalScore zorunlu",
      });
    }
    const score = {
      id: `score-${crypto.randomBytes(4).toString("hex")}`,
      sessionId,
      stationId,
      candidateId,
      checklist: checklist || {},
      globalScore: Number(globalScore),
      offlineSyncedAt: offlineSyncedAt || null,
      scoredBy: req.user.id,
      createdAt: new Date().toISOString(),
    };
    if (!db.osceScores) db.osceScores = [];
    db.osceScores.push(score);

    // Öğrenci progress güncelle (tüm öğrenciler için demo)
    if (!db.studentOsceProgress) db.studentOsceProgress = {};
    for (const uid of Object.keys(db.studentOsceProgress)) {
      if (!db.studentOsceProgress[uid][sessionId]) {
        db.studentOsceProgress[uid][sessionId] = {};
      }
      db.studentOsceProgress[uid][sessionId][stationId] = {
        status: "completed",
        scorePct: Math.round(Number(globalScore)),
      };
    }

    res.status(201).json(score);
  });

  return router;
}

module.exports = { createRoutes };
