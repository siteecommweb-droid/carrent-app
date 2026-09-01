const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({
    success: true,
    message: "analytics route working"
  });
});

module.exports = router;
