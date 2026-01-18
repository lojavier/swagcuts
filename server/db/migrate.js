require("../load-env");
const fs = require("fs");
const path = require("path");
const { getPool, isConfigured } = require("./index");

const run = async () => {
  if (!isConfigured()) {
    console.error("DATABASE_URL or PGHOST/PGUSER must be set to run migrations.");
    process.exit(1);
  }

  const pool = getPool();
  await pool.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations (id text primary key, applied_at timestamptz default now())"
  );

  const applied = await pool.query("SELECT id FROM schema_migrations");
  const appliedSet = new Set(applied.rows.map((row) => row.id));

  const migrationsDir = path.join(__dirname, "migrations");
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    if (appliedSet.has(file)) {
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log("Applied", file);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Failed to apply", file);
      throw error;
    } finally {
      client.release();
    }
  }
};

run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
