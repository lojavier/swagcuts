const https = require("https");
const querystring = require("querystring");

const request = (options, body) =>
  new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk.toString();
      });
      res.on("end", () => {
        const contentType = res.headers["content-type"] || "";
        if (contentType.includes("application/json")) {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            resolve({ raw: data });
          }
          return;
        }
        resolve({ raw: data });
      });
    });
    req.on("error", reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });

const postForm = async (options, data) => {
  const body = querystring.stringify(data);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": Buffer.byteLength(body),
    ...options.headers
  };
  return request({ ...options, headers, method: "POST" }, body);
};

const postJson = async (options, data) => {
  const body = JSON.stringify(data);
  const headers = {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
    ...options.headers
  };
  return request({ ...options, headers, method: "POST" }, body);
};

module.exports = {
  postForm,
  postJson
};
