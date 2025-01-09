const mongoose = require("mongoose");

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const sessionSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    default: Date.now,
    get: formatDate,
  },
  endTime: {
    type: Date,
    get: formatDate,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
    get: formatDate,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  duration: {
    type: Number,
  },
  referrer: {
    type: String,
    default: "Direct",
  },
  actions: [
    {
      type: { type: String },
      element: { type: String },
      text: { type: String },
      url: { type: String },
      timestamp: {
        type: Date,
        default: Date.now,
        get: formatDate,
      },
    },
  ],
  errors: [
    {
      message: String,
      stack: String,
      timestamp: {
        type: Date,
        default: Date.now,
        get: formatDate,
      },
    },
  ],
});

// Enable getters
sessionSchema.set("toJSON", { getters: true });
sessionSchema.set("toObject", { getters: true });

module.exports = mongoose.model("Session", sessionSchema);
