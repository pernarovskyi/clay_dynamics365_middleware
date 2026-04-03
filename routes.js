const express = require("express");
const { getToken, checkApiKey } = require("./auth");
const { getContactByEmail, createContact, updateContact } = require("./dynamics");

const router = express.Router();

// ====================
// 🔍 GET CONTACT API
// ====================
router.get("/contact", checkApiKey, async (req, res) => {
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
        action: "updated"
      });
    }

    // CREATE
    await createContact(email, fullname, token);

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
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running'
  });
});

module.exports = router;
