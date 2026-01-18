const { postForm } = require("../../utils/http");

const createCheckout = async ({ items }) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const successUrl = process.env.STRIPE_SUCCESS_URL || "https://www.swagcuts.com/shop/checkout.html";
  const cancelUrl = process.env.STRIPE_CANCEL_URL || "https://www.swagcuts.com/shop/cart.html";
  const currency = process.env.STRIPE_CURRENCY || "usd";

  if (!secretKey) {
    return {
      checkoutUrl: "/shop/checkout.html",
      provider: "stripe",
      status: "skipped",
      reason: "Stripe secret key missing.",
      items
    };
  }

  if (!items || !items.length) {
    return {
      checkoutUrl: "/shop/cart.html",
      provider: "stripe",
      status: "skipped",
      reason: "No items to checkout.",
      items
    };
  }

  const form = {
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl
  };

  items.forEach((item, index) => {
    const amount = Math.max(Math.round(Number(item.price || 0) * 100), 0);
    form[`line_items[${index}][quantity]`] = item.quantity || 1;
    form[`line_items[${index}][price_data][currency]`] = currency;
    form[`line_items[${index}][price_data][unit_amount]`] = amount;
    form[`line_items[${index}][price_data][product_data][name]`] =
      item.name || item.productId || "Swag Cuts item";
  });

  const auth = Buffer.from(`${secretKey}:`).toString("base64");
  try {
    const response = await postForm(
      {
        hostname: "api.stripe.com",
        path: "/v1/checkout/sessions",
        headers: {
          Authorization: `Basic ${auth}`
        }
      },
      form
    );

    return {
      checkoutUrl: response.url || "/shop/checkout.html",
      provider: "stripe",
      response
    };
  } catch (error) {
    return {
      checkoutUrl: "/shop/checkout.html",
      provider: "stripe",
      status: "failed",
      error: error.message || "Stripe request failed."
    };
  }
};

module.exports = {
  createCheckout
};
