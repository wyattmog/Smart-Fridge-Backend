const crypto = require("crypto");
const { sessions } = require("../data/sessions");

const startSession = async (req, res) => {
  try {
    const sessionId = crypto.randomBytes(8).toString("hex");
    const token = crypto.randomBytes(16).toString("hex");

    sessions.set(sessionId, {
      token,
      expiresAt: Date.now() + 30 * 60 * 1000,
      requestCount: 0,
    });

    res.json({ sessionId, token });
  } catch (error) {
    console.error("Error starting session:", error);
    res.status(500).json({ message: "Failed to start session" });
  }
};

const getSession = async (req, res) => {
  try {
  const session = sessions.get(req.params.id);

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(req.params.id);
    return res.status(410).json({ message: "Session expired" });
  }

  res.json({ sessionId: req.params.id, ...session });
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ message: "Failed to retrieve session" });
  }
};

module.exports = {
  startSession,
  getSession,
};
