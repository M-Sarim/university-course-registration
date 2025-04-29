const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    required: true,
  },
  registeredCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisteredCourse",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
