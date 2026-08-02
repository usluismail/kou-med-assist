const crypto = require("crypto");

function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

/** Token içine userId gömülür — mock restart sonrası da geçerli kalır */
function createToken(userId) {
  return `mock.${userId}.${crypto.randomBytes(8).toString("hex")}`;
}

function userIdFromToken(token) {
  const parts = String(token).split(".");
  if (parts[0] === "mock" && parts[1]) return parts[1];
  return null;
}

function authMiddleware(db) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Bearer token gerekli",
      });
    }
    const token = match[1];
    let userId = db.sessions.get(token) || userIdFromToken(token);
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Geçersiz veya süresi dolmuş token — tekrar giriş yapın",
      });
    }
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Kullanıcı bulunamadı",
      });
    }
    db.sessions.set(token, user.id);
    req.user = user;
    req.token = token;
    next();
  };
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Bu işlem için yetkiniz yok",
      });
    }
    next();
  };
}

module.exports = { publicUser, createToken, authMiddleware, requireRole };
