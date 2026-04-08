// Configuration validation
// This module ensures required environment variables are set

if (!process.env.ORG_URL) {
  throw new Error("ORG_URL is not defined in .env");
}

module.exports = {
  orgUrl: process.env.ORG_URL,
  port: process.env.PORT || 3000,
  tenantId: process.env.TENANT_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  apiKey: process.env.API_KEY
};