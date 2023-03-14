const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usFactSchema = new Schema(
  {
    stateName: {
      type: String,
    },
    capital: {
      type: String,
    },
    statehood: {
      type: Number,
    },
    majorCities: {
      type: String,
    },
    population: {
      type: Number,
    },
    area: {
      type: String,
    },
    borderingStates: {
      type: String,
    },
    nickNames: {
      type: String,
    },
    mountainRanges: {
      type: String,
    },
    rivers: {
      type: String,
    },
    lakesAndReservoirs: {
      type: String,
    },
    plateaus: {
      type: String,
    },
    islands: {
      type: String,
    },
    caves: {
      type: String,
    },
    canyons: {
      type: String,
    },
    valleys: {
      type: String,
    },
    nationalForests: {
      type: String,
    },
    nationalMonument: {
      type: String,
    },
    majorAirports: {
      type: String,
    },
    flag: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("USFact", usFactSchema);
