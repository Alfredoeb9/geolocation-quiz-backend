const Result = require("../models/resultsModel");
const mongoose = require("mongoose");
const resultsModel = require("../models/resultsModel");

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
    const { username, result, attempts, points, achived } = req.body;

    if (!username && !result) throw new Error("Data Not Provided...!");

    const createdResult = await Result.create({
      username,
      result,
      attempts,
      points,
      achived,
    });

    return res.status(201).json(createdResult);
  } catch (error) {
    console.log(error);
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
