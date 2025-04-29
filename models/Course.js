const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  days: [
    {
      type: String,
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  ],
  time: {
    type: String,
  },
  seats: {
    type: Number,
    default: 40,
  },
  prerequisites: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
