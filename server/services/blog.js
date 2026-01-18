const posts = require("../data/posts.json");
const { getBlogProvider } = require("../providers");

const listPosts = async () => {
  const provider = getBlogProvider();
  return provider.list(posts);
};

module.exports = {
  listPosts
};
