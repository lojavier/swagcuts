const create = async (payload) => {
  return {
    bookingId: "acuity_" + Date.now(),
    status: "pending",
    source: "acuity",
    receivedAt: new Date().toISOString(),
    payload
  };
};

module.exports = {
  create
};
