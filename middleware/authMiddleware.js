const User = require("../models/User");

exports.isStudent = async (req, res, next) => {
  try {
    const userId = req.cookies && req.cookies.userId;
    const role = req.cookies && req.cookies.userRole;

    if (!userId || !role) {
      return res
        .status(401)
        .render("error", { message: "User not authenticated." });
    }

    if (role !== "student") {
      return res
        .status(403)
        .render("error", { message: "Access Denied. Students only." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .render("error", { message: "User not authenticated." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("isStudent middleware error:", error);
    return res
      .status(500)
      .render("error", { message: "Internal Server Error" });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const userId = req.cookies && req.cookies.userId;
    const role = req.cookies && req.cookies.userRole;

    if (!userId || !role) {
      return res
        .status(401)
        .render("error", { message: "User not authenticated." });
    }

    if (role !== "admin") {
      return res
        .status(403)
        .render("error", { message: "Access Denied. Admins only." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .render("error", { message: "User not authenticated." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("isAdmin middleware error:", error);
    return res
      .status(500)
      .render("error", { message: "Internal Server Error" });
  }
};
