const Result = require("../models/resultsModel");
const mongoose = require("mongoose");

const getResult = async (req, res) => {
  try {
    const { username } = req.body;
    const { id } = req.params;
    const result = await Result.find({ quizId: id, username: username });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const storeResult = async (req, res) => {
  try {
    const { username, quizId, result, attempts, points, achived } = req.body;

    if (!result) throw new Error("Data Not Provided...!");

    // Normalize the result data before storing
    const normalizedResult = result.map(item => ({
      ...item,
      userAnswer: item.userAnswer ? item.userAnswer.toLowerCase().trim() : '',
      correctAnswer: item.correctAnswer ? item.correctAnswer.toLowerCase().trim() : ''
    }));

    const createdResult = await Result.create({
      username,
      quizId,
      result: normalizedResult,
      attempts,
      points,
      achived,
    });

    return res.status(201).json(createdResult);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

// const dropResult = async (req, res) => {
//   try {
//     await Result.deleteMany();
//   } catch (error) {
//     res.status(400).json({ error: error });
//   }
// };

module.exports = {
  getResult,
  storeResult,
};
