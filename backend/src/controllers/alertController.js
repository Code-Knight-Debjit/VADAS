const asyncHandler = require("../utils/asyncHandler");
const Alert = require("../models/Alert");
const { createAlert, dispatchAlert, cancelAlert } = require("../services/alertService");

exports.createAlert = asyncHandler(async (req, res) => {
  const alert = await createAlert({
    user: req.user,
    payload: req.body
  });

  res.status(201).json(alert);
});

exports.sendAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findOne({ _id: req.params.id, userId: req.user._id });
  if (!alert) {
    return res.status(404).json({ message: "Alert not found" });
  }

  const dispatched = await dispatchAlert(alert, req.user);
  return res.json(dispatched);
});

exports.cancelAlert = asyncHandler(async (req, res) => {
  const alert = await cancelAlert(req.params.id, req.user._id);
  if (!alert) {
    return res.status(404).json({ message: "Alert not found" });
  }

  return res.json(alert);
});

exports.listAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json(alerts);
});

exports.hardwareAlert = asyncHandler(async (req, res) => {
  const alert = await createAlert({
    user: req.user,
    payload: {
      type: "hardware",
      status: "pending",
      severity: req.body.severity || 9,
      source: "hardware-api",
      sensorSnapshot: req.body.sensorSnapshot || {
        threshold: 4.2,
        shakeForce: 5.1,
        deviceMotionAvailable: false
      },
      location: req.body.location,
      message: "Hardware alert received from remote source"
    }
  });

  const dispatched = await dispatchAlert(alert, req.user);
  res.status(201).json(dispatched);
});

exports.dashboardSummary = asyncHandler(async (req, res) => {
  const alerts = await Alert.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
  const summary = {
    totalAlerts: alerts.length,
    activeCountdowns: alerts.filter((item) => item.status === "countdown").length,
    failedAlerts: alerts.filter((item) => item.status === "failed").length,
    lastAlertAt: alerts[0]?.createdAt || null
  };

  res.json(summary);
});
