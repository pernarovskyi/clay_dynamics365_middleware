const fs = require("fs");
const path = require("path");

const FIELDS_FILE = path.join(__dirname, "fields.json");

const FALLBACK = {
  allowed: [
    "contactid",
    "firstname",
    "lastname",
    "fullname",
    "emailaddress1",
    "jobtitle",
    "telephone1",
    "new_linkedin",
    "new_company_name",
    "new_company_website"
  ],
  defaults: [
    "contactid",
    "firstname",
    "lastname",
    "fullname",
    "emailaddress1",
    "jobtitle",
    "telephone1",
    "new_linkedin",
    "new_company_name",
    "new_company_website"
  ]
};

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(FIELDS_FILE, "utf8"));
  } catch {
    return FALLBACK;
  }
}

function getAllowedFields() {
  return loadConfig().allowed;
}

function getDefaultFields() {
  return loadConfig().defaults;
}

module.exports = { getAllowedFields, getDefaultFields };
