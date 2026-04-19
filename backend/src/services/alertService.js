const Alert = require("../models/Alert");
const Contact = require("../models/Contact");
const { emitEvent } = require("./socketService");
const { getLastKnownLocation } = require("./locationService");
const { sendEmail, sendSms } = require("./notificationService");
const { log } = require("../utils/logger");

const MAX_ATTEMPTS = 3;

function buildAlertMessage({ user, alert }) {
  return [
    `Accident alert for ${user.name}.`,
    `Time: ${new Date(alert.timestamp).toLocaleString()}.`,
    `Location: ${alert.location.lat}, ${alert.location.lng}.`,
    `Severity: ${alert.severity}.`,
    `Source: ${alert.source}.`
  ].join(" ");
}

async function createAlert({ user, payload }) {
  const lastKnown = await getLastKnownLocation(user._id);

  const alert = await Alert.create({
    userId: user._id,
    type: payload.type || "detected",
    status: payload.status || "countdown",
    severity: payload.severity || 0,
    source: payload.source || "web",
    sensorSnapshot: payload.sensorSnapshot || {},
    location: payload.location || (lastKnown
      ? {
          lat: lastKnown.lat,
          lng: lastKnown.lng,
          accuracy: lastKnown.accuracy,
          label: "Last known location"
        }
      : undefined),
    logs: [
      {
        status: payload.status || "countdown",
        channel: "system",
        message: payload.message || "Alert created"
      }
    ]
  });

  emitEvent("alert:created", alert);
  return alert;
}

async function dispatchAlert(alert, user, attempt = 1) {
  const contacts = await Contact.find({ userId: user._id }).sort({ priority: 1 });
  const message = buildAlertMessage({ user, alert });
  const results = { sms: "skipped", email: "skipped", dashboard: "sent" };
  const failures = [];

  for (const contact of contacts) {
    if (contact.phone) {
      try {
        await sendSms({ to: contact.phone, body: message });
        results.sms = "sent";
      } catch (error) {
        failures.push(`SMS failed for ${contact.name}`);
        results.sms = "failed";
      }
    }

    if (contact.email) {
      try {
        await sendEmail({
          to: contact.email,
          subject: "Vehicle accident emergency alert",
          text: message
        });
        results.email = "sent";
      } catch (error) {
        failures.push(`Email failed for ${contact.name}`);
        results.email = "failed";
      }
    }
  }

  alert.notificationResults = results;
  alert.status = failures.length ? "failed" : "sent";
  alert.logs.push({
    status: alert.status,
    channel: "dispatcher",
    message: failures.length ? failures.join("; ") : "Alert delivered across active channels"
  });
  await alert.save();

  emitEvent("alert:updated", alert);

  if (failures.length && attempt < MAX_ATTEMPTS) {
    setTimeout(() => retryAlert(alert._id, user, attempt + 1), attempt * 4000);
  }

  return alert;
}

async function retryAlert(alertId, user, attempt) {
  const alert = await Alert.findById(alertId);
  if (!alert || alert.status === "sent" || alert.status === "cancelled") {
    return;
  }

  alert.logs.push({
    status: "retrying",
    channel: "queue",
    message: `Retry attempt ${attempt}`
  });
  await alert.save();
  log("alert", "Retrying failed alert", { alertId, attempt });
  return dispatchAlert(alert, user, attempt);
}

async function cancelAlert(alertId, userId) {
  const alert = await Alert.findOne({ _id: alertId, userId });
  if (!alert) {
    return null;
  }

  alert.status = "cancelled";
  alert.logs.push({
    status: "cancelled",
    channel: "user",
    message: "Alert cancelled within countdown window"
  });
  await alert.save();
  emitEvent("alert:updated", alert);
  return alert;
}

module.exports = {
  createAlert,
  dispatchAlert,
  cancelAlert
};
