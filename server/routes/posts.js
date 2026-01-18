const { listPosts } = require("../services/blog");

const list = async () => {
  const result = await listPosts();
  return {
    status: 200,
    body: result
  };
};

module.exports = {
  list
};
