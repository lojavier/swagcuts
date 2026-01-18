const config = require("../config");
const { ingestEvent, listEvents } = require("../services/events");

const isAuthorized = (req) => {
  const key = config.events?.readKey;
  if (!key) {
    return true;
  }
  const provided = req.headers["x-api-key"] || req.headers.authorization;
  if (!provided) {
    return false;
  }
  return provided === key || provided === `Bearer ${key}`;
};

const create = async ({ body, req }) => {
  if (!body || !body.name) {
    return {
      status: 400,
      body: {
        error: "Missing event name."
      }
    };
  }

  const result = await ingestEvent(body, req);
  if (result.error) {
    return {
      status: 400,
      body: {
        error: result.error
      }
    };
  }

  return {
    status: 201,
    body: result
  };
};

const list = async ({ query, req }) => {
  if (!isAuthorized(req)) {
    return {
      status: 401,
      body: {
        error: "Unauthorized."
      }
    };
  }

  const limit = Number.parseInt(query?.limit, 10);
  const eventName = query?.event || null;
  const sessionId = query?.sessionId || null;

  const events = await listEvents({
    limit: Number.isFinite(limit) ? limit : undefined,
    eventName,
    sessionId
  });

  return {
    status: 200,
    body: {
      events
    }
  };
};

module.exports = {
  create,
  list
};
