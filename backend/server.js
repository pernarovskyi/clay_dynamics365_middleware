require("dotenv").config();
const express = require("express");

// Validate environment
const requiredEnv = [
  "ORG_URL",
  "API_KEY",
  "TENANT_ID",
  "CLIENT_ID",
  "CLIENT_SECRET"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`${key} is not defined in .env`);
  }
});

const app = express();
app.use(express.json());

const routes = require("./api/routes");

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
