const config = require("../config");
const health = require("./health");
const bookings = require("./bookings");
const products = require("./products");
const posts = require("./posts");
const cart = require("./cart");
const events = require("./events");
const comments = require("./comments");

const prefix = config.apiPrefix;

const routes = {
  [`GET ${prefix}/health`]: health.get,
  [`POST ${prefix}/bookings`]: bookings.create,
  [`GET ${prefix}/products`]: products.list,
  [`GET ${prefix}/posts`]: posts.list,
  [`GET ${prefix}/comments`]: comments.list,
  [`GET ${prefix}/comments/admin`]: comments.listAdmin,
  [`POST ${prefix}/comments`]: comments.create,
  [`POST ${prefix}/comments/moderate`]: comments.moderate,
  [`GET ${prefix}/cart`]: cart.get,
  [`POST ${prefix}/cart/items`]: cart.addItem,
  [`POST ${prefix}/checkout`]: cart.checkout,
  [`POST ${prefix}/events`]: events.create,
  [`GET ${prefix}/events`]: events.list
};

module.exports = {
  routes
};
