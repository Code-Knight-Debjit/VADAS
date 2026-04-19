const LocationLog = require("../models/LocationLog");

async function saveLocation({ userId, lat, lng, accuracy = 0, source = "browser", isLastKnown = false }) {
  if (isLastKnown) {
    await LocationLog.updateMany({ userId, isLastKnown: true }, { isLastKnown: false });
  }

  const log = await LocationLog.create({
    userId,
    lat,
    lng,
    accuracy,
    source,
    isLastKnown
  });

  return log;
}

async function getLastKnownLocation(userId) {
  return LocationLog.findOne({ userId }).sort({ createdAt: -1 });
}

module.exports = {
  saveLocation,
  getLastKnownLocation
};
