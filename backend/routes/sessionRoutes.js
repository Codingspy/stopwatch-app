// backend/routes/sessionRoutes.js
const express = require("express");
const router = express.Router();
const Session = require("../models/session");

// Get all sessions
router.get("/", async (req, res) => {
  const sessions = await Session.find().sort({ createdAt: -1 });
  res.json(sessions);
});

// Add a new session
router.post("/", async (req, res) => {
  const { duration } = req.body;
  try {
    const newSession = new Session({ duration });
    const saved = await newSession.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
