const nodemailer = require("nodemailer");
const twilio = require("twilio");
const env = require("../config/env");
const { log } = require("../utils/logger");

let mailTransport;
let smsClient;

function getMailer() {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    return null;
  }

  if (!mailTransport) {
    mailTransport = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass
      }
    });
  }

  return mailTransport;
}

function getSmsClient() {
  if (!env.twilio.accountSid || !env.twilio.authToken || !env.twilio.from) {
    return null;
  }

  if (!smsClient) {
    smsClient = twilio(env.twilio.accountSid, env.twilio.authToken);
  }

  return smsClient;
}

async function sendEmail({ to, subject, text }) {
  const transporter = getMailer();
  if (!transporter) {
    log("notification", "Email fallback to mock transport", { to, subject });
    return { status: "mocked" };
  }

  await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text
  });

  return { status: "sent" };
}

async function sendSms({ to, body }) {
  const client = getSmsClient();
  if (!client) {
    log("notification", "SMS fallback to mock transport", { to });
    return { status: "mocked" };
  }

  await client.messages.create({
    body,
    from: env.twilio.from,
    to
  });

  return { status: "sent" };
}

module.exports = {
  sendEmail,
  sendSms
};
