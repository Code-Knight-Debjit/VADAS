const mongoose = require("mongoose");

const locationLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    accuracy: { type: Number, default: 0 },
    source: { type: String, default: "browser" },
    isLastKnown: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("LocationLog", locationLogSchema);
