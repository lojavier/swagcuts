const create = async (payload) => {
  return {
    bookingId: "bk_" + Date.now(),
    status: "pending",
    source: "custom",
    receivedAt: new Date().toISOString(),
    payload
  };
};

module.exports = {
  create
};
