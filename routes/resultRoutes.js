const express = require("express");
const { getResult, storeResult } = require("../controller/resultController");
const router = express.Router();

router.post("/:id", getResult);
router.get("/:id", getResult);

router.post("/", storeResult);

module.exports = router;
