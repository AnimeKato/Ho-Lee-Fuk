const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  _id: Number,
  hp: Number,
  name: String,
  img: String,
});

module.exports = mongoose.model("Enemies", Schema);