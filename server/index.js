require("./load-env");
const http = require("http");
const { parse } = require("url");
const { routes } = require("./routes");
const config = require("./config");

// Rate limiting storage
const rateLimitMap = new Map();

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
};

const checkRateLimit = (ip) => {
  const now = Date.now();
  const { windowMs, max } = config.rateLimit;
  let entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    entry = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(ip, entry);
    return true;
  }

  entry.count++;
  return entry.count <= max;
};

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Same-origin requests
  return config.cors.allowedOrigins.includes(origin);
};

const sendJson = (res, status, payload, origin) => {
  const allowedOrigin = isOriginAllowed(origin) ? origin : config.cors.origin;

  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-API-Key",
    ...config.security.headers
  });
  res.end(JSON.stringify(payload));
};

const collectBody = (req) =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
    req.on("end", () => {
      if (!data) {
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
  });

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  const clientIp = getClientIp(req);

  // Rate limiting
  if (!checkRateLimit(clientIp)) {
    sendJson(res, 429, { error: "Too many requests. Please try again later." }, origin);
    return;
  }

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {}, origin);
    return;
  }

  const { pathname, query } = parse(req.url, true);
  const routeKey = `${req.method} ${pathname}`;
  const handler = routes[routeKey];

  if (!handler) {
    sendJson(res, 404, { error: "Not found" }, origin);
    return;
  }

  let body = null;
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    try {
      body = await collectBody(req);
    } catch (error) {
      sendJson(res, 400, { error: "Invalid JSON body." }, origin);
      return;
    }
  }

  try {
    const result = await handler({ req, body, query });
    sendJson(res, result.status || 200, result.body || {}, origin);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error:`, error.message);
    sendJson(res, 500, { error: "Server error." }, origin);
  }
});

server.listen(config.port, () => {
  console.log(`Swag Cuts API listening on http://localhost:${config.port}${config.apiPrefix}`);
});
