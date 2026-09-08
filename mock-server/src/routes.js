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

function studentProcedures(db, userId) {
  return (db.proceduresByStudent && db.proceduresByStudent[userId]) || db.procedures;
}

function findProcedure(db, procedureId, studentId) {
  const own = studentProcedures(db, studentId);
  const hit = own.find((p) => p.id === procedureId);
  if (hit) return hit;
  for (const list of Object.values(db.proceduresByStudent || {})) {
    const p = list.find((x) => x.id === procedureId);
    if (p) return p;
  }
  return db.procedures.find((p) => p.id === procedureId) || null;
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
    const procs = studentProcedures(db, req.user.id);
    const done = procs.reduce((sum, p) => sum + p.done, 0);
    const total = procs.reduce((sum, p) => sum + p.total, 0);

    res.json({
      student,
      rotation: req.user.rotation,
      ucepProgress: { done, total, percent: total ? Math.round((done / total) * 100) : 0 },
      upcomingShift,
      logSummary: { approved, pending, total: approved + pending },
    });
  });

  router.get("/student/procedures", auth, requireRole("student"), (req, res) => {
    res.json(studentProcedures(db, req.user.id));
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

    const procedure = findProcedure(db, procedureId, req.user.id);
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
      studentPeriod: req.user.period || null,
      studentRotation: req.user.rotation || "",
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
        const proc = findProcedure(db, log.procedureId, log.studentId);
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
        studentPeriod: db.users.find((u) => u.id === log.studentId)?.period ?? null,
        studentRotation: db.users.find((u) => u.id === log.studentId)?.rotation ?? "",
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

  // ════════════════════════════════════════════════════
  // YEMEKHANESİ — Herkes erişebilir (auth isteğe bağlı)
  // ════════════════════════════════════════════════════

  /** GET /cafeteria/today — bugünün menüsü */
  router.get("/cafeteria/today", (_req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const menu =
      db.cafeteriaMenus.find((m) => m.date === today) ||
      db.cafeteriaMenus[0] ||
      null;
    res.json(menu);
  });

  /** GET /cafeteria/week — bu haftanın menüleri */
  router.get("/cafeteria/week", (_req, res) => {
    res.json(db.cafeteriaMenus);
  });

  // ════════════════════════════════════════════════════
  // GENEL DUYURULAR — Portal için
  // ════════════════════════════════════════════════════

  /** GET /announcements — tüm fakülte duyuruları */
  router.get("/announcements", (_req, res) => {
    const sorted = [...db.announcements].sort(
      (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
    );
    res.json(sorted);
  });

  /** GET /portal/announcements — giriş öncesi duyuru arşivi */
  router.get("/portal/announcements", (_req, res) => {
    const sorted = [...(db.portalAnnouncements || [])].sort(
      (a, b) => new Date(b.dateIso) - new Date(a.dateIso)
    );
    res.json(sorted);
  });

  /** GET /events — akademik etkinlik / seminer listesi */
  router.get("/events", (_req, res) => {
    const sorted = [...(db.campusEvents || [])].sort(
      (a, b) => new Date(a.dateIso) - new Date(b.dateIso)
    );
    res.json(sorted);
  });

  /** GET /hospital/places — Umuttepe yerleşke rehberi */
  router.get("/hospital/places", (_req, res) => {
    res.json(db.hospitalPlaces || []);
  });

  /** GET /faculty/directory — akademik kadro dizini (portal) */
  router.get("/faculty/directory", (_req, res) => {
    res.json(db.facultyDirectory || []);
  });

  // ════════════════════════════════════════════════════
  // DÖNEM 1-2-3 (PRE-KLİNİK) — Ders programı & danışman
  // ════════════════════════════════════════════════════

  /** GET /student/schedule — haftalık ders programı */
  router.get("/student/schedule", auth, requireRole("student"), (req, res) => {
    const schedule = db.preKlinikSchedule[req.user.id] || [];
    // Hoca bilgilerini zenginleştir
    const enriched = schedule.map((lesson) => {
      const instructor = db.supervisors.find((s) => s.id === lesson.instructorId);
      return { ...lesson, instructorName: instructor?.name || "—" };
    });
    res.json(enriched);
  });

  /** GET /student/advisor — danışman hoca bilgisi */
  router.get("/student/advisor", auth, requireRole("student"), (req, res) => {
    const advisorId = req.user.advisorId;
    if (!advisorId) {
      return res.status(404).json({ error: "Not Found", message: "Bu dönem için danışman tanımlı değil" });
    }
    const advisor = db.advisors.find((a) => a.id === advisorId);
    if (!advisor) {
      return res.status(404).json({ error: "Not Found", message: "Danışman bulunamadı" });
    }
    res.json(advisor);
  });

  // ════════════════════════════════════════════════════
  // DÖNEM 4-5 (KLİNİK STAJ) — Staj bilgisi & takvim
  // ════════════════════════════════════════════════════

  /** GET /student/internship — aktif staj blok bilgisi */
  router.get("/student/internship", auth, requireRole("student"), (req, res) => {
    const block = req.user.internshipBlock;
    if (!block) {
      return res.status(404).json({ error: "Not Found", message: "Bu dönem için staj bloğu tanımlı değil" });
    }
    const supervisor = db.supervisors.find((s) => s.id === block.supervisorId);
    res.json({ ...block, supervisorName: supervisor?.name || "—" });
  });

  /** GET /student/clinical-schedule — günlük teorik+pratik takvim */
  router.get("/student/clinical-schedule", auth, requireRole("student"), (req, res) => {
    const { date } = req.query; // opsiyonel: ?date=2026-09-01
    let schedule = db.clinicalSchedule[req.user.id] || [];

    if (date) {
      schedule = schedule.filter((s) => s.date === date);
    }

    // Hoca isimlerini zenginleştir
    const enriched = schedule.map((day) => {
      const enrichSession = (session) => {
        if (!session) return session;
        const instructor = db.supervisors.find((s) => s.id === session.instructorId);
        return { ...session, instructorName: instructor?.name || "—" };
      };
      return {
        ...day,
        morning: enrichSession(day.morning),
        afternoon: enrichSession(day.afternoon),
      };
    });

    res.json(enriched);
  });

  /** POST /student/clinical-schedule/:id/verify-attendance — QR ile devam doğrulama */
  router.post(
    "/student/clinical-schedule/:id/verify-attendance",
    auth,
    requireRole("student"),
    (req, res) => {
      const schedule = db.clinicalSchedule[req.user.id] || [];
      const dayEntry = schedule.find((s) => s.id === req.params.id);
      if (!dayEntry) {
        return res.status(404).json({ error: "Not Found", message: "Takvim kaydı bulunamadı" });
      }
      const { session } = req.body || {}; // "morning" | "afternoon"
      if (session === "morning" && dayEntry.morning) {
        dayEntry.morning.attendanceVerified = true;
      } else if (session === "afternoon" && dayEntry.afternoon) {
        dayEntry.afternoon.attendanceVerified = true;
      } else {
        return res.status(422).json({ error: "Validation", message: "session 'morning' veya 'afternoon' olmalı" });
      }
      res.json({ ok: true, sessionId: req.params.id, verified: session });
    }
  );

  // ════════════════════════════════════════════════════
  // DÖNEM 6 (İNTÖRN) — E-Karne & PDF
  // ════════════════════════════════════════════════════

  /** GET /student/ekarne — e-karne durumu */
  router.get("/student/ekarne", auth, requireRole("student"), (req, res) => {
    const karne = db.eKarne[req.user.id];
    if (!karne) {
      return res.status(404).json({ error: "Not Found", message: "E-karne bulunamadı" });
    }
    // Staj sorumlusu isimlerini zenginleştir
    const enriched = {
      ...karne,
      internships: karne.internships.map((intern) => {
        const supervisor = db.supervisors.find((s) => s.id === intern.supervisorId);
        return { ...intern, supervisorName: supervisor?.name || "—" };
      }),
    };
    res.json(enriched);
  });

  /** POST /student/ekarne/generate-pdf — PDF oluştur */
  router.post("/student/ekarne/generate-pdf", auth, requireRole("student"), (req, res) => {
    const karne = db.eKarne[req.user.id];
    if (!karne) {
      return res.status(404).json({ error: "Not Found", message: "E-karne bulunamadı" });
    }
    // Mock: PDF URL oluştur
    const pdfUrl = `https://mock-pdf.kou-tıp.edu.tr/ekarne/${req.user.id}-${Date.now()}.pdf`;
    karne.pdfGeneratedAt = new Date().toISOString();
    karne.pdfUrl = pdfUrl;

    res.json({
      ok: true,
      pdfUrl,
      generatedAt: karne.pdfGeneratedAt,
      message: "PDF başarıyla oluşturuldu",
    });
  });

  // ════════════════════════════════════════════════════
  // İLETİŞİM MERKEZİ — Öğrenci mesaj gönderme
  // ════════════════════════════════════════════════════

  /** GET /messages — öğrencinin mesaj geçmişi */
  router.get("/messages", auth, requireRole("student"), (req, res) => {
    const userMessages = db.messages
      .filter((m) => m.senderId === req.user.id)
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    res.json(userMessages);
  });

  /** POST /messages/send — yeni mesaj gönder */
  router.post("/messages/send", auth, requireRole("student"), (req, res) => {
    const { recipientType, category, body, attachments } = req.body || {};
    if (!recipientType || !category || !body || !String(body).trim()) {
      return res.status(422).json({
        error: "Validation",
        message: "recipientType, category ve body zorunlu",
      });
    }

    const validRecipients = ["student_affairs", "advisor", "internship_supervisor"];
    const validCategories = ["grade_objection", "excuse", "internship_change", "advising", "general"];

    if (!validRecipients.includes(recipientType)) {
      return res.status(422).json({ error: "Validation", message: "Geçersiz recipientType" });
    }
    if (!validCategories.includes(category)) {
      return res.status(422).json({ error: "Validation", message: "Geçersiz category" });
    }

    // Konu otomatik oluştur
    const recipientLabels = {
      student_affairs: "Öğrenci İşleri",
      advisor: "Danışman",
      internship_supervisor: "Staj Sorumlusu",
    };
    const categoryLabels = {
      grade_objection: "Not İtirazı",
      excuse: "Mazeret / Sağlık Raporu",
      internship_change: "Staj Değişikliği",
      advising: "Akademik Danışmanlık",
      general: "Genel Soru",
    };

    const subject = `[${req.user.rotation || "Öğrenci"}] ${req.user.studentNo || ""} ${req.user.name} - ${categoryLabels[category]}`;

    const message = {
      id: `msg-${Date.now()}`,
      senderId: req.user.id,
      senderName: req.user.name,
      senderStudentNo: req.user.studentNo || "",
      senderPeriod: req.user.period || null,
      senderRotation: req.user.rotation || "",
      recipientType,
      recipientLabel: recipientLabels[recipientType],
      category,
      categoryLabel: categoryLabels[category],
      subject,
      body: String(body).trim(),
      attachments: attachments || [],
      sentAt: new Date().toISOString(),
      status: "sent",
    };

    db.messages.unshift(message);
    res.status(201).json(message);
  });

  // ════════════════════════════════════════════════════
  // AKADEMİSYEN — Duyuru konsolu
  // ════════════════════════════════════════════════════

  /** GET /faculty/announcements — hocanın gönderdiği duyurular */
  router.get("/faculty/announcements", auth, requireRole("faculty"), (req, res) => {
    const myAnnouncements = db.announcements
      .filter((a) => a.authorId === req.user.id)
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
    res.json(myAnnouncements);
  });

  /** POST /faculty/announcements — yeni duyuru yayınla */
  router.post("/faculty/announcements", auth, requireRole("faculty"), (req, res) => {
    const { targetAudience, actionType, title, body, originalLesson, channels } = req.body || {};

    if (!targetAudience || !actionType || !title || !body) {
      return res.status(422).json({
        error: "Validation",
        message: "targetAudience, actionType, title ve body zorunlu",
      });
    }

    const validActionTypes = ["cancelled", "time_changed", "room_changed", "general"];
    if (!validActionTypes.includes(actionType)) {
      return res.status(422).json({ error: "Validation", message: "Geçersiz actionType" });
    }

    const announcement = {
      id: `ann-${Date.now()}`,
      authorId: req.user.id,
      authorName: req.user.name,
      targetAudience: Array.isArray(targetAudience) ? targetAudience : [targetAudience],
      actionType,
      title: String(title).trim(),
      body: String(body).trim(),
      originalLesson: originalLesson || null,
      sentAt: new Date().toISOString(),
      channels: channels || ["push", "email", "in_app"],
      isRead: false,
    };

    db.announcements.unshift(announcement);

    // Simüle: kaç kişiye ulaştığını say
    const reachedCount = Math.floor(Math.random() * 30) + 10;
    res.status(201).json({ ...announcement, reachedCount });
  });

  /** GET /faculty/students — hocanın sorumlu öğrencileri */
  router.get("/faculty/students", auth, requireRole("faculty"), (req, res) => {
    // Mock: danışman olan öğrencileri dön
    const students = db.users
      .filter((u) => u.role === "student" && u.advisorId)
      .map((u) => ({
        id: u.id,
        name: u.name,
        studentNo: u.studentNo,
        period: u.period,
        rotation: u.rotation,
        initials: u.initials,
      }));
    res.json(students);
  });

  // ════════════════════════════════════════════════════
  // DÖNEM 1-3: NOT SONUÇLARI
  // ════════════════════════════════════════════════════

  /** GET /student/grades — kurul bazlı not durumu */
  router.get("/student/grades", auth, requireRole("student"), (req, res) => {
    const studentGrades = db.grades[req.user.id];
    if (!studentGrades) {
      return res.status(404).json({ error: "Not Found", message: "Bu dönem için not verisi bulunamadı" });
    }
    res.json(studentGrades);
  });

  return router;
}

module.exports = { createRoutes };
