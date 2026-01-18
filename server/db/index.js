let pool = null;

const isConfigured = () =>
  Boolean(process.env.DATABASE_URL || process.env.PGHOST || process.env.PGUSER);

const getPool = () => {
  if (!isConfigured()) {
    return null;
  }
  if (!pool) {
    const { Pool } = require("pg");
    pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : new Pool();
  }
  return pool;
};

const query = async (text, params) => {
  const activePool = getPool();
  if (!activePool) {
    throw new Error("Database not configured.");
  }
  return activePool.query(text, params);
};

module.exports = {
  isConfigured,
  getPool,
  query
};
