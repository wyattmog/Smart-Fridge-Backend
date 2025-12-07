const { sessions } = require("../data/sessions");

async function authMiddleware(req, res, next) {
  const { "x-session-id": id, "x-session-token": token } = req.headers;
  const session = sessions.get(id);
  console.log(id, token, session);
  
  if (!session || session.token !== token) return res.status(401).json({ error: "Invalid session" });
  if (Date.now() > session.expiresAt) {
    sessions.delete(id);
    return res.status(403).json({ error: "Session expired" });
  }
  
  session.requestCount++;
  if (session.requestCount > 10) return res.status(429).json({ error: "Rate limit exceeded" });

  next();
}

module.exports = authMiddleware;