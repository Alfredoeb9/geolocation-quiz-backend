const Geolocation = require("../models/geolocationModel");
const mongoose = require("mongoose");

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
  } else if (req.method == "PUT") {
    geolocationQuiz = await Geolocation.findById(id, {
      questions: { $slice: Number(quizNum) },
    });
    // return geolocationQuiz;
  }

  if (!geolocationQuiz) {
    return res.status(400).json({ error: "No Such Quiz!" });
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
    console.log(geoTopic);
    const geoLocationName = await Geolocation.find({ country: geoTopic });
    res.status(200).json(geoLocationName);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const createGeolocationQuiz = async (req, res) => {
  // grab all request from body
  //   console.log(req.body);

  let emptyFields = [];

  const newGeolocationQuiz = new Geolocation(req.body);
  //   console.log(newGeolocationQuiz);

  if (!req.body.country) {
    emptyFields.push("title");
  }

  if (!req.body.paidContent) {
    emptyFields.push("paidContent");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    const savedGeolocationQuiz = await newGeolocationQuiz.save();

    // console.log(savedGeolocationQuiz);

    return res.status(201).json(savedGeolocationQuiz);
    // const geolocationQuiz = await Geolocation.create({
    //     country,
    //     questions
    // })
  } catch (error) {
    return res.status(400).json({ error: error });
  }
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
};
