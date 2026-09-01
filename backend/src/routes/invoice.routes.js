const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/invoice.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, ctrl.getInvoices);
router.patch("/:id", auth, ctrl.updateInvoiceStatus);
router.post("/:id/email", auth, ctrl.sendInvoiceEmail);
router.get("/:id/pdf", auth, ctrl.generateInvoicePdf);

module.exports = router;