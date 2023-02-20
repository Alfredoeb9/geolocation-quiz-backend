const express = require("express");
const {
  getGeolocationQuiz,
  getGeolocationQuizzes,
  answerGeolocationQuiz,
  createGeolocationQuiz,
  deleteGeolocationQuiz,
} = require("../controller/geolocationController");
const router = express.Router();

// require a middleware if user has paid for payment content
// those are unlocked else users will get the two free ones.
// router.use(requireAuth);

// POST new geolocation-quiz
router.post("/createquiz", createGeolocationQuiz);

// GET ALL geolocation-quiz-stages
router.get("/", getGeolocationQuizzes);

// GET ALL geolocation-quiz-stages
router.get("/:id", getGeolocationQuiz);

// DELETE seleceted geolocation-quiz
router.delete("/:id", deleteGeolocationQuiz);

// POST answers to geolocation-quiz-stages
router.post("/:id", answerGeolocationQuiz);

module.exports = router;
