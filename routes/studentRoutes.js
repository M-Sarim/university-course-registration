const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { isStudent } = require("../middleware/authMiddleware");

router.get("/dashboard", isStudent, studentController.getDashboard);

router.get("/schedule", isStudent, studentController.getSchedule);

router.get("/register", isStudent, studentController.getRegisterPage);

router.post("/register", isStudent, studentController.postRegisterCourse);

router.post("/add-course", isStudent, studentController.addCourse);

router.get(
  "/remove-course/:courseCode",
  isStudent,
  studentController.removeCourse
);

router.get("/search", isStudent, studentController.searchCourses);

module.exports = router;
