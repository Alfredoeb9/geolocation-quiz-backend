const express = require("express");
const { getResult, storeResult } = require("../controller/resultController");
const router = express.Router();

router.get("/", getResult);

router.post("/", storeResult);

module.exports = router;
