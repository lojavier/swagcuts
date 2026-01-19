const { addToCart, clearCart, createCheckout, getCart } = require("../services/commerce");
const { validateCartItem, validators, sanitize } = require("../middleware/validate");

const get = async ({ query }) => {
  const cartId = query?.cartId;
  if (!cartId) {
    return {
      status: 400,
      body: {
        error: "Missing cartId."
      }
    };
  }

  // Validate cartId format (basic alphanumeric check)
  if (typeof cartId !== "string" || cartId.length > 100) {
    return {
      status: 400,
      body: {
        error: "Invalid cartId format."
      }
    };
  }

  const result = await getCart(cartId);
  if (!result) {
    return {
      status: 404,
      body: {
        error: "Cart not found."
      }
    };
  }
  return {
    status: 200,
    body: result
  };
};

const addItem = async ({ body }) => {
  const validation = validateCartItem(body);

  if (!validation.valid) {
    return {
      status: 400,
      body: {
        error: validation.errors.join(" ")
      }
    };
  }

  const result = await addToCart(validation.data);
  return {
    status: 201,
    body: result
  };
};

const checkout = async ({ body }) => {
  const items = body?.items || [];
  const cartId = body?.cartId || null;

  // Validate cartId if provided
  if (cartId && (typeof cartId !== "string" || cartId.length > 100)) {
    return {
      status: 400,
      body: {
        error: "Invalid cartId format."
      }
    };
  }

  // Validate items array
  if (!Array.isArray(items) || items.length > 50) {
    return {
      status: 400,
      body: {
        error: "Invalid items array."
      }
    };
  }

  const result = await createCheckout({ items, cartId });
  return {
    status: 200,
    body: result
  };
};

const clear = async ({ body }) => {
  const cartId = body?.cartId;
  if (!cartId) {
    return {
      status: 400,
      body: {
        error: "Missing cartId."
      }
    };
  }

  if (typeof cartId !== "string" || cartId.length > 100) {
    return {
      status: 400,
      body: {
        error: "Invalid cartId format."
      }
    };
  }

  const result = await clearCart(cartId);
  if (!result) {
    return {
      status: 404,
      body: {
        error: "Cart not found."
      }
    };
  }

  return {
    status: 200,
    body: result
  };
};

module.exports = {
  get,
  addItem,
  checkout,
  clear
};
