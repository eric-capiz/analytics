const express = require("express");
const router = express.Router();
const Session = require("../models/session");

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

// Log error
router.post("/session/:sessionId/error", async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
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
