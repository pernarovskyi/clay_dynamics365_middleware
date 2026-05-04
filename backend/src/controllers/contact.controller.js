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
    console.error("=== ERROR [GET /contact] ===");
    console.error("Message:", err.message);
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);
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
    console.error("=== ERROR [POST /contact/upsert] ===");
    console.error("Message:", err.message);
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);
    return res.status(err.response?.status || 500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
}

async function patchContact(req, res) {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (!fields || Object.keys(fields).length === 0) {
      return res.status(400).json({ success: false, error: "Request body is empty" });
    }

    const result = await contactService.updateById(id, fields);
    return res.json({ success: true, ...result });

  } catch (err) {
    if (err.statusCode === 400) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (err.response?.status === 404) {
      return res.status(404).json({ success: false, error: "Contact not found" });
    }
    console.error("=== ERROR [PATCH /contacts/:id] ===");
    console.error("Message:", err.message);
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);
    return res.status(err.response?.status || 500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
}

module.exports = { getContact, upsertContact, patchContact };
