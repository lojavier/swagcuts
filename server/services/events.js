const crypto = require("crypto");
const { isConfigured, query } = require("../db");

const MAX_IN_MEMORY_EVENTS = 500;
const inMemoryEvents = [];

const createId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return crypto.randomBytes(16).toString("hex");
};

const sanitizeString = (value, maxLength = 2048) => {
  if (value === null || value === undefined) {
    return null;
  }
  const text = String(value).trim();
  if (!text) {
    return null;
  }
  return text.length > maxLength ? text.slice(0, maxLength) : text;
};

const coerceObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  return null;
};

const normalizeEvent = (payload, req) => {
  const name = sanitizeString(payload?.name, 120);
  if (!name) {
    return { error: "Event name is required." };
  }

  const createdAt = (() => {
    if (!payload?.timestamp) {
      return new Date();
    }
    const parsed = new Date(payload.timestamp);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  })();

  const page = coerceObject(payload?.page) || {};
  const context = coerceObject(payload?.context) || {};
  const properties = coerceObject(payload?.properties) || {};
  const utm = coerceObject(payload?.utm);

  if (!context.userAgent && req?.headers) {
    context.userAgent = sanitizeString(req.headers["user-agent"], 512);
  }
  if (!context.language && req?.headers) {
    context.language = sanitizeString(req.headers["accept-language"], 256);
  }

  return {
    id: createId(),
    name,
    sessionId: sanitizeString(payload?.sessionId, 120),
    pageUrl: sanitizeString(page.url || payload?.url, 2048),
    referrer: sanitizeString(page.referrer || payload?.referrer, 2048),
    utm,
    properties,
    context,
    createdAt: createdAt.toISOString(),
    receivedAt: new Date().toISOString()
  };
};

const storeInMemory = (event) => {
  inMemoryEvents.push(event);
  if (inMemoryEvents.length > MAX_IN_MEMORY_EVENTS) {
    inMemoryEvents.splice(0, inMemoryEvents.length - MAX_IN_MEMORY_EVENTS);
  }
};

const ingestEvent = async (payload, req) => {
  const normalized = normalizeEvent(payload, req);
  if (normalized.error) {
    return { error: normalized.error };
  }

  if (!isConfigured()) {
    storeInMemory(normalized);
    return { status: "queued", event: normalized };
  }

  await query(
    "INSERT INTO analytics_events (id, event_name, session_id, page_url, referrer, utm, properties, context, created_at) VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9)",
    [
      normalized.id,
      normalized.name,
      normalized.sessionId,
      normalized.pageUrl,
      normalized.referrer,
      normalized.utm ? JSON.stringify(normalized.utm) : null,
      JSON.stringify(normalized.properties || {}),
      JSON.stringify(normalized.context || {}),
      normalized.createdAt
    ]
  );

  return { status: "stored", event: normalized };
};

const listEvents = async ({ limit = 100, eventName, sessionId }) => {
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 500) : 100;

  if (!isConfigured()) {
    const filtered = inMemoryEvents.filter((event) => {
      if (eventName && event.name !== eventName) {
        return false;
      }
      if (sessionId && event.sessionId !== sessionId) {
        return false;
      }
      return true;
    });
    return filtered.slice(-safeLimit).reverse();
  }

  const params = [];
  const where = [];
  if (eventName) {
    params.push(eventName);
    where.push(`event_name = $${params.length}`);
  }
  if (sessionId) {
    params.push(sessionId);
    where.push(`session_id = $${params.length}`);
  }
  params.push(safeLimit);

  const sql = `
    SELECT id,
           event_name,
           session_id,
           page_url,
           referrer,
           utm,
           properties,
           context,
           created_at,
           received_at
    FROM analytics_events
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY received_at DESC
    LIMIT $${params.length}
  `;

  const result = await query(sql, params);
  return result.rows.map((row) => ({
    id: row.id,
    name: row.event_name,
    sessionId: row.session_id,
    pageUrl: row.page_url,
    referrer: row.referrer,
    utm: row.utm,
    properties: row.properties,
    context: row.context,
    createdAt: row.created_at,
    receivedAt: row.received_at
  }));
};

module.exports = {
  ingestEvent,
  listEvents
};
