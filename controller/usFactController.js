const USFact = require("../models/usFactModel");
const mongoose = require("mongoose");

const getSpecificUSFact = async (req, res) => {
  try {
    const { usState } = req.body;
    console.log(usState);
    const usFactData = await USFact.find({ stateName: usState });
    res.status(200).json(usFactData);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const createUSFact = async (req, res) => {
  let emptyFields = [];

  // console.log(req.body);

  const newUSFact = new USFact(req.body);

  // if (!req.body.stateName) {
  //   emptyFields.push("state");
  // }

  // if (!req.body.capital) {
  //   emptyFields.push("capital");
  // }

  // if (!req.body.statehood) {
  //   emptyFields.push("statehood");
  // }

  // if (emptyFields.length > 0) {
  //   return res
  //     .status(400)
  //     .json({ error: "Please fill in all the fields", emptyFields });
  // }

  try {
    const savedUSFact = await newUSFact.save();

    return res.status(201).json(savedUSFact);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

module.exports = {
  createUSFact,
  getSpecificUSFact,
};