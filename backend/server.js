require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// Validate environment
const requiredEnv = [
  "ORG_URL",
  "API_KEY",
  "TENANT_ID",
  "CLIENT_ID",
  "CLIENT_SECRET",
  "FRONTEND_URL"
];
const missing = requiredEnv.filter(key => !process.env[key]);

if (missing.length) {
  throw new Error(`Missing env variables: ${missing.join(", ")}`);
}

const app = express();

app.use(helmet());

app.use(cors({
  origin: [
    process.env.LOCALHOST_URL || "http://localhost:3000",
    process.env.FRONTEND_URL,    
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

const routes = require("./api/routes");

app.use("/api", routes);

app.get("/", (req, res, next) => {
  res.json({ status: "ok" });
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
