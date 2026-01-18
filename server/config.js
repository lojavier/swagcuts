const isDev = process.env.NODE_ENV === "development";

const config = {
  port: Number.parseInt(process.env.PORT || "3000", 10),
  apiPrefix: process.env.API_PREFIX || "/api",
  providers: {
    booking: process.env.BOOKING_PROVIDER || "custom",
    notifications: process.env.NOTIFICATIONS_PROVIDER || "custom",
    commerce: process.env.COMMERCE_PROVIDER || "custom",
    blog: process.env.BLOG_PROVIDER || "custom"
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "https://www.swagcuts.com",
    allowedOrigins: [
      "https://www.swagcuts.com",
      "https://swagcuts.com",
      ...(isDev ? ["http://localhost:5173", "http://localhost:3000"] : [])
    ]
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: Number.parseInt(process.env.RATE_LIMIT_MAX || "100", 10)
  },
  security: {
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  },
  events: {
    readKey: process.env.EVENTS_READ_KEY || ""
  },
  comments: {
    adminKey: process.env.COMMENTS_ADMIN_KEY || ""
  }
};

module.exports = config;
