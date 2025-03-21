const Course = require("../models/Course");
const User = require("../models/User");

exports.dashboard = (req, res) => {
  res.render("admin/dashboard");
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.render("admin/courseManagement", { courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).send("Server Error");
  }
};

exports.saveCourse = async (req, res) => {
  try {
    // Destructure fields from the request body.
    let {
      courseCode,
      courseName,
      department,
      level,
      days, // expecting an array from multi-select
      time,
      customTime,
      seats,
      prerequisites,
    } = req.body;

    // Use customTime if "Other" was selected.
    if (time === "Other") {
      time = customTime;
    }
    if (!time) {
      throw new Error("Time slot is required.");
    }

    // Convert prerequisites to an array (if provided as comma-separated string)
    const prereqArray = prerequisites
      ? prerequisites
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p.length)
      : [];

    let course = await Course.findOne({ courseCode });
    if (course) {
      // Update existing course
      course.courseName = courseName;
      course.department = department;
      course.level = Number(level);
      course.days = days;
      course.time = time;
      course.seats = Number(seats);
      course.prerequisites = prereqArray;
      await course.save();
    } else {
      // Create new course
      course = new Course({
        courseCode,
        courseName,
        department,
        level: Number(level),
        days,
        time,
        seats: Number(seats),
        prerequisites: prereqArray,
      });
      await course.save();
    }
    res.redirect("/admin/courses");
  } catch (error) {
    console.error("Error saving course:", error);
    res.status(500).send("Server Error");
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseCode } = req.params;
    await Course.deleteOne({ courseCode });
    res.redirect("/admin/courses");
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).send("Server Error");
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.render("admin/studentManagement", { students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).send("Server Error");
  }
};

exports.removeStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    await User.deleteOne({ username: studentId, role: "student" });
    res.redirect("/admin/students");
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).send("Server Error");
  }
};

exports.overrideRegistration = async (req, res) => {
  try {
    const { studentId, courseCode } = req.body;
    await User.collection.updateOne(
      { username: studentId, role: "student" },
      { $push: { courses: courseCode } }
    );
    res.redirect("/admin/students");
  } catch (error) {
    console.error("Error overriding registration:", error);
    res.status(500).send("Server Error");
  }
};

exports.getSeats = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.render("admin/seatManagement", { courses, selectedCourse: null });
  } catch (error) {
    console.error("Error fetching courses for seats:", error);
    res.status(500).send("Server Error");
  }
};

exports.editSeats = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const courses = await Course.find({});
    const selectedCourse = await Course.findOne({ courseCode });
    res.render("admin/seatManagement", { courses, selectedCourse });
  } catch (error) {
    console.error("Error editing seats:", error);
    res.status(500).send("Server Error");
  }
};

exports.updateSeats = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const { newSeats } = req.body;
    await Course.updateOne({ courseCode }, { seats: Number(newSeats) });
    res.redirect("/admin/seats");
  } catch (error) {
    console.error("Error updating seats:", error);
    res.status(500).send("Server Error");
  }
};

exports.getReports = (req, res) => {
  res.render("admin/reports");
};

exports.reportStudentsByCourse = async (req, res) => {
  try {
    const { courseCode } = req.query;
    const studentsForCourse = await User.find({
      role: "student",
      courses: courseCode,
    });
    res.render("admin/reports", { studentsForCourse });
  } catch (error) {
    console.error("Error generating report (students by course):", error);
    res.status(500).send("Server Error");
  }
};

exports.reportCoursesWithSeats = async (req, res) => {
  try {
    const coursesWithSeats = await Course.find({ seats: { $gt: 0 } });
    res.render("admin/reports", { coursesWithSeats });
  } catch (error) {
    console.error("Error generating report (courses with seats):", error);
    res.status(500).send("Server Error");
  }
};

exports.reportMissingPrerequisites = async (req, res) => {
  try {
    const allStudents = await User.find({ role: "student" });
    const allCourses = await Course.find({});
    const studentsMissingPrereqs = allStudents
      .filter((student) => {
        if (!student.courses || student.courses.length === 0) return false;
        return allCourses.some((course) => {
          return (
            student.courses.includes(course.courseCode) &&
            course.prerequisites.length > 0 &&
            !course.prerequisites.every((prereq) =>
              student.courses.includes(prereq)
            )
          );
        });
      })
      .map((student) => {
        const studentObj = student.toObject();
        studentObj.courseCode =
          student.courses && student.courses.length
            ? student.courses[0]
            : "N/A";
        return studentObj;
      });
    res.render("admin/reports", { studentsMissingPrereqs });
  } catch (error) {
    console.error("Error generating report (missing prerequisites):", error);
    res.status(500).send("Server Error");
  }
};
