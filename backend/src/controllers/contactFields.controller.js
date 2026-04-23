const fs = require("fs");
const path = require("path");

const FIELDS_FILE = path.join(__dirname, "../config/fields.json");

function getFields(req, res) {
  try {
    const data = JSON.parse(fs.readFileSync(FIELDS_FILE, "utf8"));
    res.json(data);
  } catch {
    res.status(500).json({ error: "Could not read fields config" });
  }
}

function updateFields(req, res) {
  const { allowed, defaults } = req.body;

  if (!Array.isArray(allowed) || !Array.isArray(defaults)) {
    return res.status(400).json({ error: "allowed and defaults must be arrays" });
  }

  const safeAllowed = Array.from(new Set(["contactid", "emailaddress1", ...allowed]));
  const safeDefaults = defaults.filter(f => safeAllowed.includes(f));
  const config = { allowed: safeAllowed, defaults: safeDefaults };

  try {
    fs.writeFileSync(FIELDS_FILE, JSON.stringify(config, null, 2));
    res.json({ success: true, ...config });
  } catch {
    res.status(500).json({ error: "Could not save fields config" });
  }
}

module.exports = { getFields, updateFields };
