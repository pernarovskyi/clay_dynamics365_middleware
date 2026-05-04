const express = require("express");
const { checkApiKey } = require("../services/auth/apiKey.middleware");
const { getContact, upsertContact, patchContact } = require("../controllers/contact.controller");

const router = express.Router();

router.get("/contact", checkApiKey, getContact);
router.post("/contact/upsert", checkApiKey, upsertContact);
router.patch("/contacts/:id", checkApiKey, patchContact);

module.exports = router;
