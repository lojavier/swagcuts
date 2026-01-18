const config = require("../config");

const bookingProviders = {
  custom: require("./booking/custom"),
  acuity: require("./booking/acuity")
};

const notificationProviders = {
  custom: require("./notifications/custom"),
  twilio: require("./notifications/twilio")
};

const commerceProviders = {
  custom: require("./commerce/custom"),
  stripe: require("./commerce/stripe")
};

const blogProviders = {
  custom: require("./blog/custom"),
  cms: require("./blog/cms")
};

const pick = (map, key, fallbackKey) => map[key] || map[fallbackKey];

const getBookingProvider = () => pick(bookingProviders, config.providers.booking, "custom");
const getNotificationsProvider = () =>
  pick(notificationProviders, config.providers.notifications, "custom");
const getCommerceProvider = () => pick(commerceProviders, config.providers.commerce, "custom");
const getBlogProvider = () => pick(blogProviders, config.providers.blog, "custom");

module.exports = {
  getBookingProvider,
  getNotificationsProvider,
  getCommerceProvider,
  getBlogProvider
};
