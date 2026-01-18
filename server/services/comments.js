const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const COMMENTS_PATH = path.join(__dirname, "..", "data", "comments.json");
const MAX_COMMENT_LENGTH = 2000;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 200;
const MAX_TITLE_LENGTH = 200;
const VALID_STATUSES = new Set(["pending", "approved", "rejected"]);

const createId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return crypto.randomBytes(16).toString("hex");
};

const sanitizeString = (value, maxLength) => {
  if (!value) {
    return "";
  }
  const text = String(value).trim();
  if (!text) {
    return "";
  }
  return text.length > maxLength ? text.slice(0, maxLength) : text;
};

const readComments = async () => {
  try {
    const raw = await fs.readFile(COMMENTS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const writeComments = async (comments) => {
  await fs.writeFile(COMMENTS_PATH, JSON.stringify(comments, null, 2));
};

const listComments = async ({ postId }) => {
  const comments = await readComments();
  return comments
    .filter((comment) => comment.postId === postId && comment.status === "approved")
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

const addComment = async ({ postId, postTitle, name, email, message }) => {
  const cleanedPostId = sanitizeString(postId, 160);
  const cleanedTitle = sanitizeString(postTitle, MAX_TITLE_LENGTH);
  const cleanedName = sanitizeString(name, MAX_NAME_LENGTH);
  const cleanedEmail = sanitizeString(email, MAX_EMAIL_LENGTH);
  const cleanedMessage = sanitizeString(message, MAX_COMMENT_LENGTH);

  if (!cleanedPostId || !cleanedName || !cleanedMessage) {
    return { error: "Missing required fields." };
  }

  const comment = {
    id: createId(),
    postId: cleanedPostId,
    postTitle: cleanedTitle || null,
    name: cleanedName,
    email: cleanedEmail || null,
    message: cleanedMessage,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const comments = await readComments();
  comments.push(comment);
  await writeComments(comments);

  return { comment };
};

const listAdminComments = async ({ postId, status, limit }) => {
  const comments = await readComments();
  const normalizedStatus = status && status !== "all" ? status : null;
  const filtered = comments.filter((comment) => {
    if (postId && comment.postId !== postId) {
      return false;
    }
    if (normalizedStatus && comment.status !== normalizedStatus) {
      return false;
    }
    return true;
  });

  const sorted = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (!limit) {
    return sorted;
  }
  const safeLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 0, 1), 500);
  return sorted.slice(0, safeLimit);
};

const updateCommentStatus = async ({ id, status }) => {
  if (!id || !VALID_STATUSES.has(status)) {
    return { error: "Invalid moderation request." };
  }

  const comments = await readComments();
  const index = comments.findIndex((comment) => comment.id === id);
  if (index === -1) {
    return { error: "Comment not found." };
  }

  comments[index].status = status;
  comments[index].updatedAt = new Date().toISOString();
  await writeComments(comments);

  return { comment: comments[index] };
};

const deleteComment = async ({ id }) => {
  if (!id) {
    return { error: "Missing comment id." };
  }

  const comments = await readComments();
  const next = comments.filter((comment) => comment.id !== id);
  if (next.length === comments.length) {
    return { error: "Comment not found." };
  }

  await writeComments(next);
  return { deletedId: id };
};

module.exports = {
  listComments,
  addComment,
  listAdminComments,
  updateCommentStatus,
  deleteComment
};
