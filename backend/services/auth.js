const axios = require("axios");

let cachedToken = null;
let tokenExpiresAt = null;
let refreshPromise = null;

async function getToken() {
  if (cachedToken && tokenExpiresAt > Date.now()) {
    return cachedToken;
  }
  if (!refreshPromise) {
    refreshPromise = fetchToken().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

async function fetchToken() {
  const orgUrl = (process.env.ORG_URL || "").replace(/\/$/, "");
  const res = await axios.post(
    `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: `${orgUrl}/.default`
    })
  );
  cachedToken = res.data.access_token;
  tokenExpiresAt = Date.now() + (res.data.expires_in - 60) * 1000;
  return cachedToken;
}

function checkApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ error: "API key missing" });
  }
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }
  next();
}

module.exports = { getToken, checkApiKey };
