const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    relationship: { type: String, default: "Emergency Contact" },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    priority: { type: Number, default: 1 },
    status: { type: String, enum: ["active", "unreachable", "pending"], default: "active" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
