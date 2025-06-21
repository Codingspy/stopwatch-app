// backend/models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  duration: {
    type: Number, // in milliseconds
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Session", sessionSchema);
