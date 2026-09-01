const express = require("express");
const router = express.Router();
const gdprController = require("../controllers/gdpr.controller");

router.post("/delete-request", gdprController.requestDeletion);

module.exports = router;