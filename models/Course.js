const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: Number, required: true },
  days: {
    type: [String],
    required: true,
    enum: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  time: { type: String, required: true },
  seats: { type: Number, default: 30 },
  prerequisites: {
    type: [String],
    default: [],
    set: function (v) {
      if (typeof v === "string") {
        return v
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length);
      }
      return v;
    },
  },
});

module.exports = mongoose.model("Course", courseSchema);
