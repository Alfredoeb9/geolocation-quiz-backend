const USFact = require("../models/usFactModel");
const mongoose = require("mongoose");

const getUSFact = async (req, res) => {
  const { id } = req.params;
  const { quizNum } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No Such Quiz!" });
  }

  const usFact = await USFact.findById(id);

  if (!usFact) {
    return res.status(400).json({ error: "No Such US Fact!" });
  }

  return res.status(200).json(usFact);
};

const getAllUSFacts = async (req, res) => {
  try {
    const allUSFacts = await USFact.find();
    return res.status(200).json(allUSFacts);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const getSpecificUSFact = async (req, res) => {
  try {
    const { usState } = req.body;
    const usFactData = await USFact.find({ stateName: usState });
    return res.status(200).json(usFactData);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const createUSFact = async (req, res) => {

  const newUSFact = new USFact(req.body);

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
  getAllUSFacts,
  getUSFact,
};
