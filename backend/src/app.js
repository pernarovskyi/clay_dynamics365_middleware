const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const contactRoutes = require("./routes/contact.routes");
const contactFieldsRoutes = require("./routes/contact.fields.routes");
const healthRoutes = require("./routes/health.routes");

const requiredEnv = ["ORG_URL", "API_KEY", "TENANT_ID", "CLIENT_ID", "CLIENT_SECRET", "FRONTEND_URL"];
const missing = requiredEnv.filter(k => !process.env[k]);
if (missing.length) throw new Error(`Missing env variables: ${missing.join(", ")}`);

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    process.env.LOCALHOST_URL || "http://localhost:3000",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log("=== INCOMING REQUEST ===");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  if (req.params && Object.keys(req.params).length) console.log("Params:", req.params);
  if (req.body && Object.keys(req.body).length) console.log("Body:", JSON.stringify(req.body));
  next();
});

app.use("/api/fields", contactFieldsRoutes);
app.use("/api", contactRoutes);
app.use("/", healthRoutes);

module.exports = app;
