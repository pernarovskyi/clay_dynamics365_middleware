const express = require("express");
const { getToken, checkApiKey } = require("./auth");
const {
  getContactByEmail,
  createContact,
  updateContact,
} = require("./dynamics");

const router = express.Router();

// ====================
// 🔍 GET CONTACT API
// ====================
router.get("/contact", checkApiKey, async (req, res) => {
  try {
    let email = req.query.email;

    // ✅ array processing
    if (Array.isArray(email)) {
      email = email[0];
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required"
      });
    }

    // 🎯 field processing
    const requestedFields = req.query.fields
      ? req.query.fields.split(",")
      : null;

    const token = await getToken();

    const contact = await getContactByEmail(
      email,
      token,
      requestedFields
    );

    if (!contact) {
      return res.json({
        success: true,
        found: false
      });
    }

    return res.json({
      success: true,
      found: true,
      ...contact // 🔥 automatically returns all selected fields
    });

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
// 🔄 UPSERT CONTACT
// ====================
router.post("/contact/upsert", checkApiKey, async (req, res) => {
  try {
    const { email, fullname } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const token = await getToken();

    const existing = await getContactByEmail(email, token);

    // UPDATE
    if (existing) {
      const data = {};

      if (fullname) data.fullname = fullname;

      await updateContact(existing.contactid, data, token);

      return res.json({
        success: true,
        action: "updated",
      });
    }

    // CREATE
    await createContact(email, fullname, token);

    res.json({
      success: true,
      action: "created",
    });
  } catch (err) {
    console.error("UPSERT ERROR:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });

    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message,
    });
  }
});

// ====================
// ❤️ HEALTH CHECK
// ====================
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API is running",
  });
});

module.exports = router;
