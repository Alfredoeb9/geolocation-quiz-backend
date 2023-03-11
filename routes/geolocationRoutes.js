const express = require("express");
const {
  getGeolocationQuiz,
  getGeolocationQuizzes,
  answerGeolocationQuiz,
  createGeolocationQuiz,
  deleteGeolocationQuiz,
  getSpecificGeolocationName,
  updateGeolocationQuiz,
} = require("../controller/geolocationController");
const { verifyAdmin, verifyUser } = require("../middleware/requireAuth");
const router = express.Router();

// require a middleware if user has paid for payment content
// those are unlocked else users will get the two free ones.
// router.use(requireAuth);

// POST new geolocation-quiz
router.post("/createquiz", verifyAdmin, createGeolocationQuiz);

// Update geolocation-quiz
router.put("/updatequiz/:id", verifyAdmin, updateGeolocationQuiz);

// GET ALL geolocation-quiz-stages
router.get("/", getGeolocationQuizzes);
router.post("/getSpecificName", getSpecificGeolocationName);

// GET one geolocation-quiz-stages
router.post("/:id", getGeolocationQuiz);
router.get("/:id", getGeolocationQuiz);

// DELETE seleceted geolocation-quiz
router.delete("/deletequiz/:id", verifyAdmin, deleteGeolocationQuiz);

// POST answers to geolocation-quiz-stages
router.post("/:id", answerGeolocationQuiz);

module.exports = router;
