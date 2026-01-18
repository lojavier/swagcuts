const list = async (posts) => {
  return {
    provider: "cms",
    posts
  };
};

module.exports = {
  list
};
