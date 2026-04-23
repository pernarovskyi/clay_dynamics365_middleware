const fs = require("fs");
const path = require("path");

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

let cache = null;

function load() {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(FIELDS_FILE, "utf8"));
    return cache;
  } catch {
    return FALLBACK;
  }
}

function invalidate() {
  cache = null;
}

function getFilePath() {
  return FIELDS_FILE;
}

module.exports = { load, invalidate, getFilePath };
