const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const RegisteredCourse = require("../models/registeredCourse");

exports.getDashboard = async (req, res) => {
  try {
    const courses = await Course.find({});
    const student = await User.findById(req.user._id).populate(
      "registeredCourses"
    );
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
exports.postRegisterCourse = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const { courseCode } = req.body;
    if (!courseCode) {
      return res
        .status(400)
        .json({ success: false, message: "Course code is required" });
    }

    const course = await Course.findOne({ courseCode });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (course.seats <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "No seats available" });
    }

    const existingRegistration = await RegisteredCourse.findOne({
      student: req.user._id,
      course: course._id,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this course",
      });
    }

    if (course.prerequisites && course.prerequisites.length > 0) {
      const completedCourses = await RegisteredCourse.find({
        student: req.user._id,
        completed: true,
      }).populate("course");

      const completedCourseCodes = completedCourses.map(
        (c) => c.course.courseCode
      );
      const missingPrerequisites = course.prerequisites.filter(
        (prereq) => !completedCourseCodes.includes(prereq)
      );

      if (missingPrerequisites.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Missing prerequisites",
          missingPrerequisites,
          requiredPrerequisites: course.prerequisites,
        });
      }
    }

    const registration = await RegisteredCourse.create({
      student: req.user._id,
      course: course._id,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { registeredCourses: registration._id },
    });

    await Course.findByIdAndUpdate(course._id, {
      $inc: { seats: -1 },
    });

    res.json({ success: true, message: "Course registered successfully" });
  } catch (error) {
    console.error("Error registering course:", error);
    res
      .status(500)
      .json({ success: false, message: "Error registering course" });
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

exports.getRegisteredCourses = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const student = await User.findById(req.user._id).populate({
      path: "registeredCourses",
      populate: { path: "course" },
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const courses = student.registeredCourses.map((registration) => ({
      courseCode: registration.course.courseCode,
      courseName: registration.course.courseName,
      department: registration.course.department,
      level: registration.course.level,
      days: registration.course.days,
      time: registration.course.time,
      completed: registration.completed,
      grade: registration.grade,
      registrationId: registration._id,
    }));

    res.json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching registered courses:", error);
    res.status(500).json({ success: false, message: "Error fetching courses" });
  }
};

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

    const registration = await RegisteredCourse.create({
      studentId,
      courseCode,
      registered: true,
    });

    await User.findByIdAndUpdate(studentId, {
      $push: { registeredCourses: registration._id },
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

    const removedRegistration = await RegisteredCourse.findOneAndDelete({
      courseCode,
      studentId,
    });
    if (removedRegistration) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { registeredCourses: removedRegistration._id },
      });
    }
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
    if (day) query.days = { $in: [day] };
    if (time) query.time = time;

    const courses = await Course.find(query);
    res.json({ courses });
  } catch (error) {
    console.error("Search Courses error:", error);
    res.status(500).json({ error: "Search error" });
  }
};

exports.markCourseComplete = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const { registrationId, grade } = req.body;
    if (!registrationId) {
      return res
        .status(400)
        .json({ success: false, message: "Registration ID is required" });
    }

    const updatedRegistration = await RegisteredCourse.findByIdAndUpdate(
      registrationId,
      { completed: true, grade },
      { new: true }
    ).populate("course");

    if (!updatedRegistration) {
      return res
        .status(404)
        .json({ success: false, message: "Registration not found" });
    }

    res.json({
      success: true,
      message: "Course marked as completed",
      course: {
        courseCode: updatedRegistration.course.courseCode,
        courseName: updatedRegistration.course.courseName,
        completed: updatedRegistration.completed,
        grade: updatedRegistration.grade,
      },
    });
  } catch (error) {
    console.error("Error marking course complete:", error);
    res
      .status(500)
      .json({ success: false, message: "Error marking course complete" });
  }
};

exports.getCompletedCourses = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const completedCourses = await RegisteredCourse.find({
      student: req.user._id,
      completed: true,
    }).populate("course");

    const courses = completedCourses.map((registration) => ({
      courseCode: registration.course.courseCode,
      courseName: registration.course.courseName,
      department: registration.course.department,
      level: registration.course.level,
      completed: registration.completed,
      grade: registration.grade,
      completionDate: registration.updatedAt,
    }));

    res.json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching completed courses:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching completed courses" });
  }
};

exports.dropCourse = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const { courseCode } = req.params;
    if (!courseCode) {
      return res
        .status(400)
        .json({ success: false, message: "Course code is required" });
    }

    const course = await Course.findOne({ courseCode });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const registration = await RegisteredCourse.findOneAndDelete({
      student: req.user._id,
      course: course._id,
    });

    if (!registration) {
      return res
        .status(404)
        .json({ success: false, message: "Course registration not found" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { registeredCourses: registration._id },
    });

    await Course.findByIdAndUpdate(course._id, {
      $inc: { seats: 1 },
    });

    res.json({ success: true, message: "Course dropped successfully" });
  } catch (error) {
    console.error("Error dropping course:", error);
    res.status(500).json({ success: false, message: "Error dropping course" });
  }
};
