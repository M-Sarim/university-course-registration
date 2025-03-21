const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["student", "admin"], required: true },
});

module.exports = mongoose.model("User", userSchema);
