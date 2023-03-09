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
        question: { type: String },
        answer: { type: String },
        id: { type: Number },
      },
    ],
  },
  { timestamps: true },
  { typeKey: "$type" }
);

module.exports = mongoose.model("GeolocationQuiz", geolocationQuizSchema);
