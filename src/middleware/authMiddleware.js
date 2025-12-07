const { sessions } = require("../data/sessions");

async function authMiddleware(req, res, next) {
  try {
  const { "x-session-id": id, "x-session-token": token } = req.headers;
  const session = sessions.get(id);

  console.log(`id: ${id}, token: ${token}, session: ${JSON.stringify(session)}`);
  
  if (!session || session.token !== token) return res.status(401).json({ error: "Invalid session" });
  if (Date.now() > session.expiresAt) {
    sessions.delete(id);
    return res.status(403).json({ error: "Session expired" });
  }
  
  session.requestCount++;
  if (session.requestCount > 10) return res.status(429).json({ error: "Rate limit exceeded" });

  next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = authMiddleware;