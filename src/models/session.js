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
  referrer: {
    type: String,
    default: "Direct",
  },
  deviceInfo: {
    type: {
      type: String,
      enum: ["mobile", "tablet", "desktop"],
    },
    browser: String,
    browserVersion: String,
    screenWidth: Number,
    screenHeight: Number,
  },
  location: {
    country: String,
    region: String,
    city: String,
    timezone: String,
  },
  trafficSource: {
    type: {
      type: String,
      enum: ["direct", "social", "search", "referral"],
    },
    source: String,
    medium: String,
    campaign: String,
  },
  scrollTracking: [
    {
      section: {
        type: String,
        enum: ["about", "projects", "skills", "contact"],
      },
      maxScrollDepth: {
        type: Number,
        min: 0,
        max: 100,
      },
      timeSpent: Number,
      timestamp: {
        type: Date,
        default: Date.now,
        get: formatDate,
      },
    },
  ],
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
