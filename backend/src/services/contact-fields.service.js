const fs = require("fs");
const path = require("path");
const { load, invalidate } = require("../loaders/fields.loader");

const FIELDS_FILE = path.join(__dirname, "../config/fields.json");

const FALLBACK = {
  allowed: [
    "contactid", "firstname", "lastname", "fullname",
    "emailaddress1", "jobtitle", "telephone1",
    "new_linkedin", "new_company_name", "new_company_website"
  ],
  defaults: [
    "contactid", "firstname", "lastname", "fullname",
    "emailaddress1", "jobtitle", "telephone1",
    "new_linkedin", "new_company_name", "new_company_website"
  ]
};

function getConfig() {
  return load() || FALLBACK;
}

function getAllowed() {
  return getConfig().allowed;
}

function getDefaults() {
  return getConfig().defaults;
}

function save(allowed, defaults) {
  const safeAllowed = Array.from(new Set(["contactid", "emailaddress1", ...allowed]));
  const safeDefaults = defaults.filter(f => safeAllowed.includes(f));
  const config = { allowed: safeAllowed, defaults: safeDefaults };
  fs.writeFileSync(FIELDS_FILE, JSON.stringify(config, null, 2));
  invalidate();
  return config;
}

module.exports = { getConfig, getAllowed, getDefaults, save };
