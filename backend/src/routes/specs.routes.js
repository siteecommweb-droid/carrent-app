const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({
    success: true,
    specs: []
  });
});

module.exports = router;
