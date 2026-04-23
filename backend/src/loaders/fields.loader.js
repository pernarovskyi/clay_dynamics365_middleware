const fs = require("fs");
const path = require("path");

const FIELDS_FILE = path.join(__dirname, "../config/CRM.fields.json");

let cache = null;

function load() {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(FIELDS_FILE, "utf8"));
    return cache;
  } catch {
    return null;
  }
}

function invalidate() {
  cache = null;
}

module.exports = { load, invalidate };
