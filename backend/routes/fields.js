const express = require("express");
const fs = require("fs");
const path = require("path");
const { checkApiKey } = require("../services/auth");

const router = express.Router();
const FIELDS_FILE = path.join(__dirname, "../config/fields.json");

// GET /api/fields — returns current allowed + default fields
router.get("/", checkApiKey, (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FIELDS_FILE, "utf8"));
    res.json(data);
  } catch {
    res.status(500).json({ error: "Could not read fields config" });
  }
});

// PUT /api/fields — saves updated allowed + default fields
router.put("/", checkApiKey, (req, res) => {
  const { allowed, defaults } = req.body;

  if (!Array.isArray(allowed) || !Array.isArray(defaults)) {
    return res.status(400).json({ error: "allowed and defaults must be arrays" });
  }

  // contactid and emailaddress1 are required for the API to function
  const safeAllowed = Array.from(new Set(["contactid", "emailaddress1", ...allowed]));
  const safeDefaults = defaults.filter(f => safeAllowed.includes(f));

  const config = { allowed: safeAllowed, defaults: safeDefaults };

  try {
    fs.writeFileSync(FIELDS_FILE, JSON.stringify(config, null, 2));
    res.json({ success: true, ...config });
  } catch {
    res.status(500).json({ error: "Could not save fields config" });
  }
});

module.exports = router;
