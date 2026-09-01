const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const ctrl = require("../controllers/reservations.controller");
const auth = require("../middleware/auth.middleware");

const dir = path.join(__dirname, "..", "..", "uploads", "reservations");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname || ".jpg")}`),
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });

router.post("/", upload.fields([
  { name: "passport", maxCount: 1 },
  { name: "id_doc", maxCount: 1 },
  { name: "licence", maxCount: 1 },
]), ctrl.createReservation);

router.get("/mine", auth, ctrl.myReservations);
router.get("/", auth, ctrl.listReservations);
router.get("/:id", ctrl.getReservation);
router.patch("/:id", auth, ctrl.updateReservationStatus);

module.exports = router;