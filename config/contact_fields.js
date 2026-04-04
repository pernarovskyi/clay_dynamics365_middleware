// whitelist (add new fields here as needed)
const ALLOWED_FIELDS = [
  "contactid",
  "fullname",
  "emailaddress1",
  "jobtitle",
  "telephone1"
];

// default fields for GET CONTACT BY EMAIL endpoint
const DEFAULT_FIELDS = [
  "contactid",
  "fullname",
  "emailaddress1"
];

module.exports = {
  ALLOWED_FIELDS,
  DEFAULT_FIELDS
};