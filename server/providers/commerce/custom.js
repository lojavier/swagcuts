const createCheckout = async ({ items }) => {
  return {
    checkoutUrl: "/shop/checkout.html",
    provider: "custom",
    items
  };
};

module.exports = {
  createCheckout
};
