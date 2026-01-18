const { createBooking } = require("../services/bookings");
const { validateBooking } = require("../middleware/validate");

const create = async ({ body }) => {
  const validation = validateBooking(body);

  if (!validation.valid) {
    return {
      status: 400,
      body: {
        error: validation.errors.join(" ")
      }
    };
  }

  const result = await createBooking(validation.data);
  return {
    status: 201,
    body: result
  };
};

module.exports = {
  create
};
