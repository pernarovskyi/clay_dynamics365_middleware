const express = require("express");
const { getToken, checkApiKey } = require("../services/auth");
const { getContactByEmail, createContact, updateContact } = require("../services/dynamics");
const { getAllowedFields } = require("../config/contact_fields");

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ====================
// GET CONTACT
// ====================
router.get("/contact", checkApiKey, async (req, res) => {
  try {
    let email = req.query.email;
    if (Array.isArray(email)) email = email[0];

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    const requestedFields = req.query.fields ? req.query.fields.split(",") : null;
    const token = await getToken();
    const contact = await getContactByEmail(email, token, requestedFields);

    if (!contact) {
      return res.json({ success: true, found: false });
    }

    return res.json({ success: true, found: true, ...contact });

  } catch (err) {
    console.error("GET /contact error:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    return res.status(err.response?.status || 500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

// ====================
// UPSERT CONTACT
// ====================
router.post("/contact/upsert", checkApiKey, async (req, res) => {
  try {
    const { email, ...rest } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    // Accept any allowed field except contactid (system-managed)
    const writable = getAllowedFields().filter(f => f !== "contactid");
    const contactData = Object.fromEntries(
      Object.entries(rest).filter(([k]) => writable.includes(k))
    );

    const token = await getToken();
    const existing = await getContactByEmail(email, token);

    if (existing) {
      if (Object.keys(contactData).length > 0) {
        await updateContact(existing.contactid, contactData, token);
      }
      return res.json({ success: true, action: "updated", contactid: existing.contactid });
    }

    const createRes = await createContact({ emailaddress1: email, ...contactData }, token);

    // Extract contactid from the OData-EntityId response header
    const entityHeader = createRes.headers?.["odata-entityid"] || "";
    const match = entityHeader.match(/\(([^)]+)\)$/);
    const contactid = match?.[1] || null;

    return res.json({ success: true, action: "created", contactid });

  } catch (err) {
    console.error("UPSERT ERROR:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    return res.status(err.response?.status || 500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

// ====================
// HEALTH CHECK
// ====================
router.get("/", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

module.exports = router;
