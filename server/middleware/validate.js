/**
 * Input validation and sanitization utilities
 */

const validators = {
  email: (value) => {
    if (!value) return true; // Optional field
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },

  phone: (value) => {
    if (!value) return true; // Optional field
    return /^[\d\s\-+()]{7,20}$/.test(value);
  },

  slug: (value) => {
    if (!value) return false;
    return /^[a-z0-9-]+$/.test(value);
  },

  date: (value) => {
    if (!value) return false;
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  },

  time: (value) => {
    if (!value) return false;
    return /^\d{2}:\d{2}$/.test(value);
  },

  uuid: (value) => {
    if (!value) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  }
};

const sanitize = {
  string: (value, maxLength = 500) => {
    if (typeof value !== "string") return "";
    return value.trim().slice(0, maxLength);
  },

  int: (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return null;
    return Math.min(Math.max(num, min), max);
  },

  float: (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    return Math.min(Math.max(num, min), max);
  }
};

const allowedValues = {
  size: ["small", "medium", "large"],
  service: ["signature", "bath", "special"]
};

const validateBooking = (body) => {
  const errors = [];

  if (!body) {
    return { valid: false, errors: ["Request body is required."] };
  }

  // Required fields
  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
    errors.push("Name is required.");
  }
  if (!body.pet || typeof body.pet !== "string" || body.pet.trim().length === 0) {
    errors.push("Pet name is required.");
  }
  if (!body.service || !allowedValues.service.includes(body.service)) {
    errors.push("Valid service selection is required.");
  }
  if (!body.size || !allowedValues.size.includes(body.size)) {
    errors.push("Valid size selection is required.");
  }
  if (!body.date || !validators.date(body.date)) {
    errors.push("Valid date (YYYY-MM-DD) is required.");
  }
  if (!body.time || !validators.time(body.time)) {
    errors.push("Valid time (HH:MM) is required.");
  }

  // Optional fields validation
  if (body.email && !validators.email(body.email)) {
    errors.push("Invalid email format.");
  }
  if (body.phone && !validators.phone(body.phone)) {
    errors.push("Invalid phone format.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Sanitize and return validated body
  return {
    valid: true,
    data: {
      name: sanitize.string(body.name, 100),
      email: body.email ? sanitize.string(body.email, 254) : null,
      phone: body.phone ? sanitize.string(body.phone, 20) : null,
      pet: sanitize.string(body.pet, 50),
      size: body.size,
      service: body.service,
      date: body.date,
      time: body.time,
      notes: body.notes ? sanitize.string(body.notes, 1000) : null,
      consents: body.consents || {},
      policyVersions: body.policyVersions || {}
    }
  };
};

const validateCartItem = (body) => {
  const errors = [];

  if (!body) {
    return { valid: false, errors: ["Request body is required."] };
  }

  if (!body.productId || typeof body.productId !== "string") {
    errors.push("Product ID is required.");
  } else if (!validators.slug(body.productId)) {
    errors.push("Invalid product ID format.");
  }

  const quantity = sanitize.int(body.quantity || 1, 1, 99);
  if (quantity === null) {
    errors.push("Invalid quantity (must be 1-99).");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      productId: sanitize.string(body.productId, 100),
      quantity,
      name: body.name ? sanitize.string(body.name, 200) : null,
      price: body.price ? sanitize.float(body.price, 0, 10000) : null
    }
  };
};

module.exports = {
  validators,
  sanitize,
  allowedValues,
  validateBooking,
  validateCartItem
};
