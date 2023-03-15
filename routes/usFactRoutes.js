const express = require("express");
const router = express.Router();
const {
  createUSFact,
  getSpecificUSFact,
  getAllUSFacts,
  getUSFact,
} = require("../controller/usFactController");

const { verifyAdmin } = require("../middleware/requireAuth");

router.get("/", getAllUSFacts);
router.get("/:id", getUSFact);

router.post("/createUSFact", verifyAdmin, createUSFact);
router.post("/getSpecificUSFact", getSpecificUSFact);

module.exports = router;
