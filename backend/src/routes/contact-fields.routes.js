const express = require("express");
const { checkApiKey } = require("../services/auth/apiKey.middleware");
const { getFields, updateFields } = require("../controllers/contact-fields.controller");

const router = express.Router();

router.get("/", checkApiKey, getFields);
router.put("/", checkApiKey, updateFields);

module.exports = router;
