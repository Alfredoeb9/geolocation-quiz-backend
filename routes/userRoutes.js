const express = require("express");
const router = express.Router();

const {
  getUsers,
  getOneUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");

router.get("/", getUsers);

router.get("/:id", getOneUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
