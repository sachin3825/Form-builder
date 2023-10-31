const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["comprehension", "categorize", "cloze"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  options: [String],
  answer: {
    type: String,
  },
  categories: [String],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", questionSchema);
