const config = require("../config");
const { isConfigured } = require("../db");

const get = async () => {
  return {
    status: 200,
    body: {
      status: "ok",
      providers: config.providers,
      database: {
        configured: isConfigured()
      }
    }
  };
};

module.exports = {
  get
};
