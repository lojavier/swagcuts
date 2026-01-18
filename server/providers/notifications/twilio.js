const { postForm, postJson } = require("../../utils/http");

const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  fromNumber: process.env.TWILIO_FROM_NUMBER
};

const sendgridConfig = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.SENDGRID_FROM_EMAIL
};

const sendEmail = async ({ to, subject, body }) => {
  if (!sendgridConfig.apiKey || !sendgridConfig.fromEmail) {
    return {
      status: "skipped",
      channel: "email",
      provider: "sendgrid",
      reason: "SendGrid credentials missing.",
      to,
      subject
    };
  }

  const payload = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: sendgridConfig.fromEmail },
    subject,
    content: [{ type: "text/plain", value: body }]
  };

  const response = await postJson(
    {
      hostname: "api.sendgrid.com",
      path: "/v3/mail/send",
      headers: {
        Authorization: `Bearer ${sendgridConfig.apiKey}`
      }
    },
    payload
  );

  return {
    status: "sent",
    channel: "email",
    provider: "sendgrid",
    to,
    response
  };
};

const sendSms = async ({ to, body }) => {
  if (!twilioConfig.accountSid || !twilioConfig.authToken || !twilioConfig.fromNumber) {
    return {
      status: "skipped",
      channel: "sms",
      provider: "twilio",
      reason: "Twilio credentials missing.",
      to
    };
  }

  const auth = Buffer.from(
    `${twilioConfig.accountSid}:${twilioConfig.authToken}`
  ).toString("base64");

  const response = await postForm(
    {
      hostname: "api.twilio.com",
      path: `/2010-04-01/Accounts/${twilioConfig.accountSid}/Messages.json`,
      headers: {
        Authorization: `Basic ${auth}`
      }
    },
    {
      From: twilioConfig.fromNumber,
      To: to,
      Body: body
    }
  );

  return {
    status: "sent",
    channel: "sms",
    provider: "twilio",
    to,
    response
  };
};

module.exports = {
  sendEmail,
  sendSms
};
