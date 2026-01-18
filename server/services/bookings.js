const { getBookingProvider, getNotificationsProvider } = require("../providers");
const { isConfigured, query } = require("../db");

const createBooking = async (payload) => {
  const bookingProvider = getBookingProvider();
  const notificationsProvider = getNotificationsProvider();

  let recordId = null;
  if (isConfigured()) {
    const customerResult = await query(
      "INSERT INTO customers (name, email, phone, marketing_opt_in) VALUES ($1, $2, $3, $4) RETURNING id",
      [
        payload.name,
        payload.email || null,
        payload.phone || null,
        Boolean(payload.consents?.marketing)
      ]
    );
    const customerId = customerResult.rows[0].id;

    const petResult = await query(
      "INSERT INTO pets (owner_id, name, size, notes) VALUES ($1, $2, $3, $4) RETURNING id",
      [customerId, payload.pet, payload.size || null, payload.notes || null]
    );
    const petId = petResult.rows[0].id;

    const appointmentResult = await query(
      "INSERT INTO appointments (owner_id, pet_id, service, appointment_date, appointment_time, status, notes, policy_versions, consents, session_id, attribution) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id",
      [
        customerId,
        petId,
        payload.service,
        payload.date,
        payload.time,
        "pending",
        payload.notes || null,
        JSON.stringify(payload.policyVersions || {}),
        JSON.stringify(payload.consents || {}),
        payload.analytics?.sessionId || null,
        payload.analytics?.attribution ? JSON.stringify(payload.analytics.attribution) : null
      ]
    );
    recordId = appointmentResult.rows[0].id;
  }

  const booking = await bookingProvider.create(payload);
  const notifications = [];

  const safeSend = async (fn) => {
    try {
      return await fn();
    } catch (error) {
      return {
        status: "failed",
        error: error.message || "Notification failed."
      };
    }
  };

  if (payload.consents?.sms && payload.phone) {
    notifications.push(
      await safeSend(() =>
        notificationsProvider.sendSms({
          to: payload.phone,
          body: "Swag Cuts received your booking request. We will confirm shortly."
        })
      )
    );
  }

  if (payload.consents?.email && payload.email) {
    notifications.push(
      await safeSend(() =>
        notificationsProvider.sendEmail({
          to: payload.email,
          subject: "Swag Cuts booking request received",
          body: "We will confirm your appointment and pricing shortly."
        })
      )
    );
  }

  return {
    recordId,
    booking,
    notifications
  };
};

module.exports = {
  createBooking
};
