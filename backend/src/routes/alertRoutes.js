const express = require("express");
const auth = require("../middleware/auth");
const controller = require("../controllers/alertController");

const router = express.Router();

router.use(auth);
router.get("/", controller.listAlerts);
router.post("/", controller.createAlert);
router.get("/summary", controller.dashboardSummary);
router.post("/trigger-hardware-alert", controller.hardwareAlert);
router.post("/:id/send", controller.sendAlert);
router.post("/:id/cancel", controller.cancelAlert);

module.exports = router;
