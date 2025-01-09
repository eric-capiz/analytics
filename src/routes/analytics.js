const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// Check for inactive sessions
const checkInactivity = async (session) => {
  const now = new Date();
  const lastActivity = new Date(session.lastActivity);
  const inactiveTime = (now - lastActivity) / 1000; // Convert to seconds

  if (inactiveTime >= 180 && session.status === "active") {
    // 3 minutes
    session.status = "inactive";
    session.endTime = now;
    session.duration = (session.endTime - session.startTime) / 1000;
    await session.save();
  }
};

// Start new session
router.post("/session/start", async (req, res) => {
  try {
    const session = new Session({
      referrer: req.body.referrer,
    });
    await session.save();
    res.status(201).json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record action
router.post("/session/:sessionId/action", async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    await checkInactivity(session);

    if (session.status === "inactive") {
      return res.status(400).json({ error: "Session is inactive" });
    }

    session.lastActivity = new Date();
    session.actions.push({
      type: req.body.type,
      element: req.body.element,
      text: req.body.text,
      url: req.body.url,
    });
    await session.save();
    res.status(200).json({ message: "Action recorded" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End session
router.put("/session/:sessionId/end", async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    await checkInactivity(session);

    if (session.status === "inactive") {
      return res.status(400).json({ error: "Session already ended" });
    }

    session.status = "inactive";
    session.endTime = new Date();
    session.duration = (session.endTime - session.startTime) / 1000;
    await session.save();
    res.status(200).json({ message: "Session ended" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log error
router.post("/session/:sessionId/error", async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    await checkInactivity(session);

    if (session.status === "inactive") {
      return res.status(400).json({ error: "Session is inactive" });
    }

    session.lastActivity = new Date();
    session.errors.push({
      message: req.body.message,
      stack: req.body.stack,
    });
    await session.save();
    res.status(200).json({ message: "Error logged" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
