const express = require("express");
const router = express.Router();
const {
  getUsers,
  getOneUser,
  updateUser,
  deleteUser,
  postLogin,
  signUpUser,
} = require("../controller/userController");

const {
  requireAuth,
  verifyAdmin,
  verifyUser,
} = require("../middleware/requireAuth");

// GET ALL USERS
router.get("/", verifyAdmin, getUsers);

// GET ONCE USER
router.get("/:id", verifyUser, getOneUser);

// UPDATE USER
router.put("/:id", verifyUser, updateUser);

// DELETE USER
router.delete("/:id", verifyUser, deleteUser);

module.exports = router;
