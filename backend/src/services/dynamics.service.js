const axios = require("axios");
const { getToken } = require("./auth/token.service");
const { getAllowed, getDefaults } = require("./contactFields.service");

const ORG_URL = (process.env.ORG_URL || "").replace(/\/$/, "");

async function request(method, url, data = null) {
  const token = await getToken();
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

async function getContactByEmail(email, requestedFields = null) {
  const safeEmail = String(email).replace(/'/g, "''");

  let fields = getDefaults();
  if (requestedFields && Array.isArray(requestedFields)) {
    const filtered = requestedFields.filter(f => getAllowed().includes(f));
    if (filtered.length > 0) fields = filtered;
  }

  const select = fields.includes("contactid") ? fields : ["contactid", ...fields];
  const url = `${ORG_URL}/api/data/v9.2/contacts?$filter=emailaddress1 eq '${safeEmail}'&$select=${select.join(",")}`;

  const res = await request("GET", url);
  return res.data.value[0];
}

async function createContact(data) {
  return request("POST", `${ORG_URL}/api/data/v9.2/contacts`, data);
}

async function updateContact(contactId, data) {
  return request("PATCH", `${ORG_URL}/api/data/v9.2/contacts(${contactId})`, data);
}

module.exports = { getContactByEmail, createContact, updateContact };
