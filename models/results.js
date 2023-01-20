const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resultsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  timing: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Results", resultsSchema);
