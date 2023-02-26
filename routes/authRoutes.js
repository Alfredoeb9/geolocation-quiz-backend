const express = require("express");
const {
  register,
  login,
  verifyEmail,
} = require("../controller/authController");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.post("/register", register);
// protect this route
router.post("/verify-email", requireAuth, verifyEmail);
router.post("/login", login);

module.exports = router;
