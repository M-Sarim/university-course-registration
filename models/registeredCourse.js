const mongoose = require("mongoose");

const registeredCourseSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    registered: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

registeredCourseSchema.index({ studentId: 1, courseCode: 1 }, { unique: true });

module.exports = mongoose.model("RegisteredCourse", registeredCourseSchema);
