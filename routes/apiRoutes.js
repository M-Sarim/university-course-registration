const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

router.get("/courses", apiController.getCourses);

module.exports = router;
