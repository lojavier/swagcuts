const config = require("../config");
const {
  addComment,
  listComments,
  listAdminComments,
  updateCommentStatus,
  deleteComment
} = require("../services/comments");

const isAuthorized = (req) => {
  const key = config.comments?.adminKey;
  if (!key) {
    return true;
  }
  const provided = req.headers["x-api-key"] || req.headers.authorization;
  if (!provided) {
    return false;
  }
  return provided === key || provided === `Bearer ${key}`;
};

const list = async ({ query }) => {
  const postId = query?.postId;
  if (!postId) {
    return {
      status: 400,
      body: {
        error: "Missing postId."
      }
    };
  }

  const comments = await listComments({ postId });
  return {
    status: 200,
    body: {
      comments
    }
  };
};

const listAdmin = async ({ query, req }) => {
  if (!isAuthorized(req)) {
    return {
      status: 401,
      body: {
        error: "Unauthorized."
      }
    };
  }

  const status = query?.status || "all";
  const postId = query?.postId || null;
  const limit = query?.limit || null;

  const comments = await listAdminComments({ postId, status, limit });

  return {
    status: 200,
    body: {
      comments
    }
  };
};

const create = async ({ body }) => {
  if (!body) {
    return {
      status: 400,
      body: {
        error: "Missing request body."
      }
    };
  }

  const result = await addComment(body);
  if (result.error) {
    return {
      status: 400,
      body: {
        error: result.error
      }
    };
  }

  return {
    status: 201,
    body: {
      status: "pending",
      comment: result.comment
    }
  };
};

const moderate = async ({ body, req }) => {
  if (!isAuthorized(req)) {
    return {
      status: 401,
      body: {
        error: "Unauthorized."
      }
    };
  }

  if (!body || !body.id) {
    return {
      status: 400,
      body: {
        error: "Missing comment id."
      }
    };
  }

  if (body.action === "delete") {
    const result = await deleteComment({ id: body.id });
    if (result.error) {
      return {
        status: 400,
        body: {
          error: result.error
        }
      };
    }
    return {
      status: 200,
      body: result
    };
  }

  const result = await updateCommentStatus({ id: body.id, status: body.status });
  if (result.error) {
    return {
      status: 400,
      body: {
        error: result.error
      }
    };
  }

  return {
    status: 200,
    body: {
      comment: result.comment
    }
  };
};

module.exports = {
  list,
  listAdmin,
  create,
  moderate
};
