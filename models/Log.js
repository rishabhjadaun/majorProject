const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  passwordAttempt: String,
  success: Boolean,
});

module.exports = mongoose.model("Log", logSchema);
