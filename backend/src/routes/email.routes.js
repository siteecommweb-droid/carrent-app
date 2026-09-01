const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({
    success: true,
    emails: []
  });
});

router.post("/send", async (req, res) => {
  res.json({
    success: true,
    message: "Email sent"
  });
});

module.exports = router;
