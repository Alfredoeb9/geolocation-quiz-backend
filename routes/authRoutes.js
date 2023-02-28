const express = require("express");
const {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
} = require("../controller/authController");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.post("/register", register);
// protect this route
router.post("/verify-email", requireAuth, verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/login", login);

module.exports = router;
