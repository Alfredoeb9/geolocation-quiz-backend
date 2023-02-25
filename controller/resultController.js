const Result = require("../models/resultsModel");
const mongoose = require("mongoose");

const getResult = async (req, res) => {
  try {
    const result = await Result.find();

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const storeResult = async (req, res) => {
  try {
    const { username, quizId, result, attempts, points, achived } = req.body;

    if (!result) throw new Error("Data Not Provided...!");

    const createdResult = await Result.create({
      username,
      quizId,
      result,
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
