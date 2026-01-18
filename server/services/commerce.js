const products = require("../data/products.json");
const { getCommerceProvider } = require("../providers");
const { isConfigured, query } = require("../db");

const listProducts = async () => {
  if (!isConfigured()) {
    return products;
  }
  const result = await query(
    "SELECT id, name, price, category, tags, url FROM products WHERE is_active = true ORDER BY name"
  );
  if (!result.rows.length) {
    return products;
  }
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category,
    tags: row.tags,
    url: row.url
  }));
};

const addToCart = async (item) => {
  if (!isConfigured()) {
    return {
      cartId: "cart_demo",
      status: "added",
      item
    };
  }

  let cartId = item.cartId;
  if (!cartId) {
    const cartResult = await query("INSERT INTO carts (status) VALUES ('open') RETURNING id");
    cartId = cartResult.rows[0].id;
  }

  const quantity = Number.parseInt(item.quantity, 10) || 1;
  const price = item.price !== null && item.price !== undefined ? Number(item.price) : null;

  await query(
    "INSERT INTO cart_items (cart_id, product_id, product_name, price, quantity) VALUES ($1, $2, $3, $4, $5)",
    [cartId, item.productId, item.name || null, price, quantity]
  );
  await query("UPDATE carts SET updated_at = now() WHERE id = $1", [cartId]);

  return {
    cartId,
    status: "added",
    item
  };
};

const getCart = async (cartId) => {
  if (!isConfigured()) {
    return null;
  }
  const cartResult = await query(
    "SELECT id, status, created_at, updated_at FROM carts WHERE id = $1",
    [cartId]
  );
  if (!cartResult.rows.length) {
    return null;
  }
  const itemsResult = await query(
    "SELECT id, product_id, product_name, price, quantity FROM cart_items WHERE cart_id = $1 ORDER BY created_at",
    [cartId]
  );
  const items = itemsResult.rows.map((row) => ({
    id: row.id,
    productId: row.product_id,
    name: row.product_name,
    price: Number(row.price),
    quantity: row.quantity
  }));
  const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  return {
    cart: cartResult.rows[0],
    items,
    total
  };
};

const createCheckout = async ({ items, cartId }) => {
  let checkoutItems = items;
  if (!checkoutItems?.length && cartId && isConfigured()) {
    const cart = await getCart(cartId);
    checkoutItems = cart?.items || [];
  }
  const provider = getCommerceProvider();
  return provider.createCheckout({ items: checkoutItems || [] });
};

module.exports = {
  listProducts,
  addToCart,
  getCart,
  createCheckout
};
