const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const histroySchema = new Schema({
  totalCorrect: {
    type: Number,
    required: true,
  },
  totalWrong: {
    type: Number,
    required: true,
  },
  totalSpeed: {
    type: Number,
    required: true,
  },
  missword: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Histroy", histroySchema);
