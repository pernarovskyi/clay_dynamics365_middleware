const express = require("express");
const { checkApiKey } = require("../services/auth.service");
const { getFields, updateFields } = require("../controllers/contactFields.controller");

const router = express.Router();

router.get("/", checkApiKey, getFields);
router.put("/", checkApiKey, updateFields);

module.exports = router;
