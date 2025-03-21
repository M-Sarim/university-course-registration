const Course = require("../models/Course");

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Error fetching courses." });
  }
};
