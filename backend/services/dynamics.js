const axios = require("axios");
const { getAllowedFields, getDefaultFields } = require("../config/contact_fields");

const ORG_URL = (process.env.ORG_URL || "").replace(/\/$/, "");

async function dynamicsRequest(method, url, token, data = null) {
  return axios({
    method,
    url,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0"
    }
  });
}

async function getContactByEmail(email, token, requestedFields = null) {
  if (!email) return null;

  const safeEmail = String(email).replace(/'/g, "''");
  const allowed = getAllowedFields();
  const defaults = getDefaultFields();

  let fields = defaults;

  if (requestedFields && Array.isArray(requestedFields)) {
    const filtered = requestedFields.filter(f => allowed.includes(f));
    if (filtered.length > 0) {
      fields = filtered;
    }
  }

  // contactid must always be present so callers can reference the record
  const select = fields.includes("contactid") ? fields : ["contactid", ...fields];

  const url = `${ORG_URL}/api/data/v9.2/contacts?$filter=emailaddress1 eq '${safeEmail}'&$select=${select.join(",")}`;

  const res = await dynamicsRequest("GET", url, token);
  return res.data.value[0];
}

async function createContact(data, token) {
  return dynamicsRequest(
    "POST",
    `${ORG_URL}/api/data/v9.2/contacts`,
    token,
    data
  );
}

async function updateContact(contactId, data, token) {
  return dynamicsRequest(
    "PATCH",
    `${ORG_URL}/api/data/v9.2/contacts(${contactId})`,
    token,
    data
  );
}

module.exports = {
  dynamicsRequest,
  getContactByEmail,
  createContact,
  updateContact
};
