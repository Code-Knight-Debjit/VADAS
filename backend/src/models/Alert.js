const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["detected", "manual", "hardware", "retry"],
      default: "detected"
    },
    severity: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "countdown", "cancelled", "sent", "failed"],
      default: "pending"
    },
    source: { type: String, default: "web" },
    sensorSnapshot: {
      shakeForce: { type: Number, default: 0 },
      threshold: { type: Number, default: 3.2 },
      deviceMotionAvailable: { type: Boolean, default: false }
    },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      label: { type: String, default: "Unknown" }
    },
    logs: [
      {
        status: String,
        channel: String,
        message: String,
        timestamp: { type: Date, default: Date.now }
      }
    ],
    notificationResults: {
      sms: { type: String, default: "queued" },
      email: { type: String, default: "queued" },
      dashboard: { type: String, default: "queued" }
    },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
