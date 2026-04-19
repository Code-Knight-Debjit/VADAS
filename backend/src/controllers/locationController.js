const asyncHandler = require("../utils/asyncHandler");
const LocationLog = require("../models/LocationLog");
const { saveLocation } = require("../services/locationService");

exports.createLocationLog = asyncHandler(async (req, res) => {
  const entry = await saveLocation({
    userId: req.user._id,
    ...req.body
  });

  res.status(201).json(entry);
});

exports.listLocationLogs = asyncHandler(async (req, res) => {
  const logs = await LocationLog.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json(logs);
});
