const { isValidEmail } = require("../utils/validators");
const contactService = require("../services/contact.service");

async function getContact(req, res) {
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
    const contact = await contactService.getByEmail(email, requestedFields);

    if (!contact) return res.json({ success: true, found: false });
    return res.json({ success: true, found: true, ...contact });

  } catch (err) {
    console.error("GET /contact:", err.response?.data || err.message);
    return res.status(err.response?.status || 500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
}

async function upsertContact(req, res) {
  try {
    const { email, ...fields } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    const result = await contactService.upsert(email, fields);
    return res.json({ success: true, ...result });

  } catch (err) {
    console.error("POST /contact/upsert:", err.response?.data || err.message);
    return res.status(err.response?.status || 500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
}

module.exports = { getContact, upsertContact };
