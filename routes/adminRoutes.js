const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.dashboard);
router.get("/dashboard", adminController.dashboard);

router
  .route("/courses")
  .get(adminController.getCourses)
  .post(adminController.saveCourse);

router.get("/course/delete/:courseCode", adminController.deleteCourse);

router.route("/students").get(adminController.getStudents);
router.get("/student/remove/:studentId", adminController.removeStudent);
router.post("/override", adminController.overrideRegistration);

router.route("/seats").get(adminController.getSeats);
router.get("/seats/edit/:courseCode", adminController.editSeats);
router.post("/seats/update/:courseCode", adminController.updateSeats);

router.get("/reports", adminController.getReports);
router.get("/reports/studentsByCourse", adminController.reportStudentsByCourse);
router.get("/reports/coursesWithSeats", adminController.reportCoursesWithSeats);
router.get(
  "/reports/missingPrerequisites",
  adminController.reportMissingPrerequisites
);

module.exports = router;
