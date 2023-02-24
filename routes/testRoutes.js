const express = require("express");
const { getTest } = require("../controller/getTestController");
const router = express.Router();

// GET ALL geolocation-quiz-stages
router.get("/", getTest);

module.exports = router;
