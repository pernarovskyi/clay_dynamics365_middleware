require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const ORG_URL = process.env.ORG_URL;
const PORT = process.env.PORT || 3000;

// ====================
// 🔐 TOKEN
// ====================
let cachedToken = null;
let tokenExpiresAt = null;

async function getToken() {
  if (cachedToken && tokenExpiresAt > Date.now()) {
    return cachedToken;
  }

  const res = await axios.post(
    `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: `${ORG_URL}/.default`
    })
  );

  cachedToken = res.data.access_token;
  tokenExpiresAt = Date.now() + (res.data.expires_in - 60) * 1000;

  return cachedToken;
}

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
// 🔍 GET CONTACT (shared logic)
// ====================
async function getContactByEmail(email, token) {
  if (!email) return null;

  const safeEmail = String(email).replace(/'/g, "''");

  const url = `${ORG_URL}/api/data/v9.2/contacts?$filter=emailaddress1 eq '${safeEmail}'&$select=contactid,fullname,emailaddress1`;

  const res = await dynamicsRequest("GET", url, token);

  return res.data.value[0];
}

// ====================
// 🔍 GET CONTACT API
// ====================
app.get("/api/contact", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const token = await getToken();
    const contact = await getContactByEmail(email, token);

    if (!contact) {
      return res.json({ found: false });
    }

    res.json({
      found: true,
      contactid: contact.contactid,
      fullname: contact.fullname || "",
      email: contact.emailaddress1 || ""
    });

  } catch (err) {
    console.error("GET ERROR:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });

    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message
    });
  }
});

// ====================
// 🔄 UPSERT CONTACT
// ====================
app.post("/api/contact/upsert", async (req, res) => {
  try {
    const { email, fullname } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const token = await getToken();

    const existing = await getContactByEmail(email, token);

    // ====================
    // ✏️ UPDATE
    // ====================
    if (existing) {
      const data = {};

      if (fullname) data.fullname = fullname;

      await dynamicsRequest(
        "PATCH",
        `${ORG_URL}/api/data/v9.2/contacts(${existing.contactid})`,
        token,
        data
      );

      return res.json({
        success: true,
        action: "updated"
      });
    }

    // ====================
    // ➕ CREATE
    // ====================
    await dynamicsRequest(
      "POST",
      `${ORG_URL}/api/data/v9.2/contacts`,
      token,
      {
        fullname: fullname || "",
        emailaddress1: String(email).replace(/'/g, "''")
      }
    );

    res.json({
      success: true,
      action: "created"
    });

  } catch (err) {
    console.error("UPSERT ERROR:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });

    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message
    });
  }
});

// ====================
// ❤️ HEALTH CHECK
// ====================
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ====================
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));