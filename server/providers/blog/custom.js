const list = async (posts) => {
  return {
    provider: "custom",
    posts
  };
};

module.exports = {
  list
};
