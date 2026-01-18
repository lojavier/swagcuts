const fs = require("fs");
const path = require("path");

const loadEnv = () => {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }
  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  lines.forEach((line) => {
    if (!line || line.trim().startsWith("#")) {
      return;
    }
    const index = line.indexOf("=");
    if (index === -1) {
      return;
    }
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
};

loadEnv();
