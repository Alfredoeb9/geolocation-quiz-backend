const express = require("express");
const {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  updateUser,
  forgotPassword,
  resetPassword,
} = require("../controller/authController");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/login", login);
router.put("/updateuser", updateUser);
// protect this route
router.post("/verify-email", requireAuth, verifyEmail);
router.post("/reset-password", requireAuth, resetPassword);


module.exports = router;
