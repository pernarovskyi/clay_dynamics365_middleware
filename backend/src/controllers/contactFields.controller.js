const contactFieldsService = require("../services/contactFields.service");

function getFields(req, res) {
  try {
    res.json(contactFieldsService.getConfig());
  } catch {
    res.status(500).json({ error: "Could not read fields config" });
  }
}

function updateFields(req, res) {
  const { allowed, defaults } = req.body;
  if (!Array.isArray(allowed) || !Array.isArray(defaults)) {
    return res.status(400).json({ error: "allowed and defaults must be arrays" });
  }
  try {
    const config = contactFieldsService.save(allowed, defaults);
    res.json({ success: true, ...config });
  } catch {
    res.status(500).json({ error: "Could not save fields config" });
  }
}

module.exports = { getFields, updateFields };
