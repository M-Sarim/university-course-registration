const mongoose = require("mongoose");

const registeredCourseSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  grade: {
    type: String,
    enum: ["A", "B", "C", "D", "F", "W", "I", null],
    default: null,
  },
});
registeredCourseSchema.index({ student: 1, course: 1 }, { unique: true });
module.exports = mongoose.model("RegisteredCourse", registeredCourseSchema);
