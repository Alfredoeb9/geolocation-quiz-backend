const express = require("express");
const router = express.Router();
const {
  createUSFact,
  getSpecificUSFact,
} = require("../controller/usFactController");

const { verifyAdmin } = require("../middleware/requireAuth");

router.post("/createUSFact", verifyAdmin, createUSFact);
router.post("/getSpecificUSFact", getSpecificUSFact);

module.exports = router;
