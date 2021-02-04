const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  _id: Number,
  u1: String,
  u2: String,
  score: Number,
});

module.exports = mongoose.model("Match", Schema);