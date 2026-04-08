const axios = require("axios");
const { ALLOWED_FIELDS, DEFAULT_FIELDS } = require("../config/contact_fields");

const ORG_URL = process.env.ORG_URL;

// ====================
// 🔧 DYNAMICS API WRAPPER
// ====================
async function dynamicsRequest(method, url, token, data = null) {
  return axios({
    method,
    url,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}

// ====================
// 🔍 GET CONTACT BY EMAIL
// ====================
async function getContactByEmail(email, token, requestedFields = null) {
  if (!email) return null;

  const safeEmail = String(email).replace(/'/g, "''");

  // ====================
  // 🎯 Check fields
  // ====================

  let fields = DEFAULT_FIELDS;

  if (requestedFields && Array.isArray(requestedFields)) {
    const filtered = requestedFields.filter(f =>
      ALLOWED_FIELDS.includes(f)
    );

    if (filtered.length > 0) {
      fields = filtered;
    }
  }

  const select = fields.join(",");

  const url = `${ORG_URL}/api/data/v9.2/contacts?$filter=emailaddress1 eq '${safeEmail}'&$select=${select}`;

  const res = await dynamicsRequest("GET", url, token);

  return res.data.value[0];
}

// ====================
// ➕ CREATE CONTACT
// ====================
async function createContact(email, fullname, token) {
  return dynamicsRequest(
    "POST",
    `${ORG_URL}/api/data/v9.2/contacts`,
    token,
    {
      fullname: fullname || "",
      emailaddress1: String(email).replace(/'/g, "''")
    }
  );
}

// ====================
// ✏️ UPDATE CONTACT
// ====================
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
