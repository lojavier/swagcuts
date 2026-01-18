const sendEmail = async ({ to, subject, body }) => {
  return {
    status: "queued",
    channel: "email",
    provider: "custom",
    to,
    subject,
    body
  };
};

const sendSms = async ({ to, body }) => {
  return {
    status: "queued",
    channel: "sms",
    provider: "custom",
    to,
    body
  };
};

module.exports = {
  sendEmail,
  sendSms
};
