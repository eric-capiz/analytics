const express = require("express");
const router = express.Router();
const Session = require("../models/session");

// Start new session
router.post("/session/start", async (req, res) => {
  try {
    const session = new Session({
      referrer: req.body.referrer,
      deviceInfo: req.body.deviceInfo,
      location: req.body.location,
      trafficSource: req.body.trafficSource,
    });
    await session.save();
    res.status(201).json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update scroll tracking
router.post("/session/:sessionId/scroll", async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Handle array of scroll data
    const scrollDataArray = Array.isArray(req.body) ? req.body : [req.body];

    for (const { section, maxScrollDepth, timeSpent } of scrollDataArray) {
      // Update or add scroll tracking for the section
      const existingSection = session.scrollTracking.find(
        (track) => track.section === section
      );

      if (existingSection) {
        // Update if new scroll depth is higher
        if (maxScrollDepth > existingSection.maxScrollDepth) {
          existingSection.maxScrollDepth = maxScrollDepth;
        }
        existingSection.timeSpent += timeSpent;
      } else {
        // Add new section tracking
        session.scrollTracking.push({
          section,
          maxScrollDepth,
          timeSpent,
        });
      }
    }

    session.lastActivity = new Date();
    await session.save();
    res.status(200).json({ message: "Scroll tracking updated" });
  } catch (error) {
    console.error("Scroll tracking error:", error);
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

// End session (tab close / navigation away)
router.post("/session/:sessionId/end", async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    session.status = "inactive";
    session.lastActivity = new Date();
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
