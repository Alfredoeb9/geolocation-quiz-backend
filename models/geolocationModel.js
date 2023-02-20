const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const geolocationQuizSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GeolocationQuiz", geolocationQuizSchema);
