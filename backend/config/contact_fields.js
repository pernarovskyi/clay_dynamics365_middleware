// whitelist (add new fields here as needed)
const ALLOWED_FIELDS = [
  "contactid",
  "fullname",
  "emailaddress1",
  "jobtitle",
  "telephone1",
  "new_linkedin",
  "new_company_name",
  "new_company_website"
];

// default fields for GET CONTACT BY EMAIL endpoint
const DEFAULT_FIELDS = [
  "contactid",
  "fullname",
  "emailaddress1",
  "jobtitle",
  "new_linkedin"
];

module.exports = {
  ALLOWED_FIELDS,
  DEFAULT_FIELDS
};