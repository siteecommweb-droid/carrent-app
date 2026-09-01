const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/otp.controller");

router.post("/send", ctrl.sendCode);
router.post("/verify", ctrl.verifyCode);

module.exports = router;