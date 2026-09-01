const express = require("express");
const passport = require("passport");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

// ============================================================
// LOCAL AUTH
// ============================================================
router.post("/register", authController.register);
router.post("/login", authController.login);

// ----- NEW ROUTES ADDED HERE (after /login) -----
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/phone-login", authController.phoneLogin);
// ------------------------------------------------

router.get("/me", auth, authController.me);

// ============================================================
// GOOGLE OAUTH - CORRECT (with session: false)
// ============================================================
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login`,
  }),
  authController.googleCallback
);

module.exports = router;