const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const RegisteredCourse = require("../models/registeredCourse");

exports.getDashboard = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.render("student/dashboard", { courses });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.render("error", { message: "Error loading student dashboard" });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    res.render("student/schedule");
  } catch (error) {
    console.error("Schedule error:", error);
    res.render("error", { message: "Error loading schedule page" });
  }
};

exports.getRegisterPage = async (req, res) => {
  try {
    res.render("student/registerCourse");
  } catch (error) {
    console.error("Register Page error:", error);
    res.render("error", { message: "Error loading register course page" });
  }
};

exports.postRegisterCourse = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    let { courseCode } = req.body;
    if (!courseCode) {
      return res
        .status(400)
        .json({ success: false, message: "Course code is required" });
    }
    if (!Array.isArray(courseCode)) {
      courseCode = [courseCode];
    }

    const studentId = req.user._id;
    const registrations = [];
    const errors = [];

    for (const code of courseCode) {
      try {
        const registration = await RegisteredCourse.create({
          studentId,
          courseCode: code,
          registered: true,
        });
        registrations.push(registration);
      } catch (error) {
        if (error.code === 11000) {
          errors.push({
            courseCode: code,
            message: "Already registered for this course",
          });
        } else {
          errors.push({
            courseCode: code,
            message: "Error registering course",
          });
        }
      }
    }

    if (errors.length > 0) {
      return res.status(207).json({ success: true, registrations, errors });
    }
    return res.json({ success: true, registrations });
  } catch (error) {
    console.error("Register Course error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error registering course(s)" });
  }
};

// Alternative endpoint for adding a course (non-AJAX form submission).
exports.addCourse = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .render("error", { message: "User not authenticated" });
    }

    const { courseCode } = req.body;
    if (!courseCode) {
      return res
        .status(400)
        .render("error", { message: "Course code is required" });
    }

    const studentId = req.user._id;

    await RegisteredCourse.create({
      studentId,
      courseCode,
      registered: true,
    });
    res.redirect("/student/dashboard");
  } catch (error) {
    console.error("Add Course error:", error);
    res.render("error", { message: "Error adding course" });
  }
};
exports.removeCourse = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .render("error", { message: "User not authenticated" });
    }

    const { courseCode } = req.params;
    const studentId = req.user._id;

    await RegisteredCourse.findOneAndDelete({ courseCode, studentId });
    res.redirect("/student/dashboard");
  } catch (error) {
    console.error("Remove Course error:", error);
    res.render("error", { message: "Error removing course" });
  }
};
exports.searchCourses = async (req, res) => {
  try {
    const { department, level, day, time } = req.query;
    let query = {};

    if (department) query.department = department;
    if (level) query.level = Number(level);
    if (day) {
      query.days = { $in: [day] };
    }
    if (time) {
      query.time = time;
    }

    const courses = await Course.find(query);
    res.json({ courses });
  } catch (error) {
    console.error("Search Courses error:", error);
    res.status(500).json({ error: "Search error" });
  }
};
