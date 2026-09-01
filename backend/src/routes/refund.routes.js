const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/refund.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, ctrl.createRefundRequest);
router.get("/", auth, ctrl.listRefunds);
router.patch("/:id", auth, ctrl.updateRefundStatus);

module.exports = router;