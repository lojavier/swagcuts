const { listProducts } = require("../services/commerce");

const list = async () => {
  const items = await listProducts();
  return {
    status: 200,
    body: {
      items
    }
  };
};

module.exports = {
  list
};
