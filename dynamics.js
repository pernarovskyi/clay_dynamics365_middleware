const axios = require("axios");

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
async function getContactByEmail(email, token) {
  if (!email) return null;

  const safeEmail = String(email).replace(/'/g, "''");

  const url = `${ORG_URL}/api/data/v9.2/contacts?$filter=emailaddress1 eq '${safeEmail}'&$select=contactid,fullname,emailaddress1`;

  const res = await dynamicsRequest("GET", url, token);

  return res.data.value?.[0] || null;
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
