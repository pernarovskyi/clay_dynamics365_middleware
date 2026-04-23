const fs = require("fs");
const { load, invalidate, getFilePath } = require("../loaders/fields.loader");

function getConfig() {
  return load();
}

function getAllowed() {
  return load().allowed;
}

function getDefaults() {
  return load().defaults;
}

function save(allowed, defaults) {
  const safeAllowed = Array.from(new Set(["contactid", "emailaddress1", ...allowed]));
  const safeDefaults = defaults.filter(f => safeAllowed.includes(f));
  const config = { allowed: safeAllowed, defaults: safeDefaults };
  fs.writeFileSync(getFilePath(), JSON.stringify(config, null, 2));
  invalidate();
  return config;
}

module.exports = { getConfig, getAllowed, getDefaults, save };
