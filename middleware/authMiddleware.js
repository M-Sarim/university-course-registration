exports.isAdmin = (req, res, next) => {
  try {
    const role = req.cookies && req.cookies.userRole;
    if (!role) {
      return res
        .status(401)
        .render("error", { message: "User not authenticated." });
    }
    if (role !== "admin") {
      return res
        .status(403)
        .render("error", { message: "Access Denied. Admins only." });
    }
    next();
  } catch (error) {
    console.error("isAdmin middleware error:", error);
    return res
      .status(500)
      .render("error", { message: "Internal Server Error" });
  }
};

exports.isStudent = (req, res, next) => {
  try {
    const role = req.cookies && req.cookies.userRole;
    if (!role) {
      return res
        .status(401)
        .render("error", { message: "User not authenticated." });
    }
    if (role !== "student") {
      return res
        .status(403)
        .render("error", { message: "Access Denied. Students only." });
    }
    req.user = { _id: "1234567890abcdef" };
    next();
  } catch (error) {
    console.error("isStudent middleware error:", error);
    return res
      .status(500)
      .render("error", { message: "Internal Server Error" });
  }
};
