const express = require("express");
const auth = require("../middleware/auth");
const alertController = require("../controllers/alertController");
const authRoutes = require("./authRoutes");
const alertRoutes = require("./alertRoutes");
const contactRoutes = require("./contactRoutes");
const locationRoutes = require("./locationRoutes");
const ragRoutes = require("./ragRoutes");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/alert", alertRoutes);
router.use("/alerts", alertRoutes);
router.use("/contacts", contactRoutes);
router.use("/location", locationRoutes);
router.use("/rag", ragRoutes);
router.post("/trigger-hardware-alert", auth, alertController.hardwareAlert);

module.exports = router;
