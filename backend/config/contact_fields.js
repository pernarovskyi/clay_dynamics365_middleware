// whitelist (add new fields here as needed)
const ALLOWED_FIELDS = [
  "contactid",  
  "firstname",
  "lastname",
  "fullname",
  "emailaddress1",
  "jobtitle",
  "telephone1",
  "new_linkedin",
  "new_company_name",
  "new_company_website",
  "company"
];

// default fields for GET CONTACT BY EMAIL endpoint
const DEFAULT_FIELDS = [
  "contactid",  
  "firstname",
  "lastname",
  "fullname",
  "emailaddress1",
  "jobtitle",
  "telephone1",
  "new_linkedin",
  "new_company_name",
  "new_company_website",
  "company"
];

module.exports = {
  ALLOWED_FIELDS,
  DEFAULT_FIELDS
};