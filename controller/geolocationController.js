const Geolocation = require("../models/geolocationModel");
const mongoose = require("mongoose");
const { shuffleArray } = require("../lib/utils/shuffleArray");

const getGeolocationQuiz = async (req, res) => {
  // grab the id of the geolocation quiz wanting to play in the URL
  const { id } = req.params;
  const { quizNum } = req.body;

  let geolocationQuiz;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such Quiz!" });
  }

  if (req.method == "GET") {
    geolocationQuiz = await Geolocation.findById(id);
    // return geolocationQuiz;
  } else if (req.method == "POST") {
    // Use MongoDB aggregation to get random questions
    const result = await Geolocation.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$questions" },
      { $sample: { size: Number(quizNum) } }, // Get random questions
      { 
        $group: {
          _id: "$_id",
          country: { $first: "$country" },
          title: { $first: "$title" },
          questions: { $push: "$questions" }
        }
      }
    ]);

    geolocationQuiz = result[0] || null;
  }

  if (!geolocationQuiz) {
    return res.status(400).json({ error: "No Such Quiz!" });
  }

  // Normalize answers when sending quiz data
  if (geolocationQuiz.questions) {
    geolocationQuiz.questions = geolocationQuiz.questions.map(question => ({
      ...question,
      answer: question.answer.toLowerCase().trim() // Normalize correct answers
    }));
  }

  return res.status(200).json(geolocationQuiz);
};

const getGeolocationQuizzes = async (req, res) => {
  try {
    const allGeolocationQuizzes = await Geolocation.find();
    res.status(200).json(allGeolocationQuizzes);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const getSpecificGeolocationName = async (req, res) => {
  try {
    const { geoTopic } = req.body;
    const geoLocationName = await Geolocation.find({ country: geoTopic });
    res.status(200).json(geoLocationName);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const createGeolocationQuiz = async (req, res) => {
  // grab all request from body
  let emptyFields = [];

  const newGeolocationQuiz = new Geolocation(req.body);

  if (!req.body.country) {
    emptyFields.push("title");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    const savedGeolocationQuiz = await newGeolocationQuiz.save();


    return res.status(201).json(savedGeolocationQuiz);

  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const updateGeolocationQuiz = async (req, res) => {
  const { id } = req.params;
  const questionsUpdating = req?.body?.data;
  const idTargets = [];
  const questionTargets = [];
  let questionAnswerData = [];
  let findData;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such question" });
  }

  req?.body?.data?.map((id, index) => {
    idTargets.push(id?.id);

    questionAnswerData.push({
      id: id?.id,
      question: id?.question,
      answer: id?.answer,
    });
  });

  questionAnswerData.map(async (value) => {
    findData = await Geolocation.updateOne(
      {
        _id: id,
        "questions.id": value?.id,
      },
      {
        $set: {
          "questions.$.question": value?.question,
          "questions.$.answer": value?.answer,
        },
      },
      { new: true }
    );
  });

  return res.status(200).json({ msg: "Documents updated...!" });
};

const deleteGeolocationQuiz = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such Geolocation Quiz" });
  }

  const geolocationQuiz = await Geolocation.findOneAndDelete({ _id: id });

  if (!geolocationQuiz) {
    return res.status(400).json({ error: "No such geolocation quiz!" });
  }

  return res.status(200).json(geolocationQuiz);
};

const answerGeolocationQuiz = async (req, res) => {
  console.log(req.body);
};

module.exports = {
  getGeolocationQuiz,
  getGeolocationQuizzes,
  createGeolocationQuiz,
  deleteGeolocationQuiz,
  answerGeolocationQuiz,
  getSpecificGeolocationName,
  updateGeolocationQuiz,
};
