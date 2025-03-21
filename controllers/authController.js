const User = require("../models/User");

exports.getLogin = (req, res) => {
  res.render("auth/login");
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username) {
      return res.render("error", {
        message: "Username / Roll Number is required",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.render("error", { message: "User not found" });
    }

    if (role === "admin" && user.role !== "admin") {
      return res.render("error", { message: "This user is not an admin" });
    }
    if (role === "student" && user.role !== "student") {
      return res.render("error", { message: "This user is not a student" });
    }

    if (user.role === "admin") {
      if (!password) {
        return res.render("error", {
          message: "Password is required for admin login",
        });
      }
      if (user.password !== password) {
        return res.render("error", { message: "Invalid admin password" });
      }
    }

    res.cookie("userRole", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("username", user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    if (user.role === "admin") {
      return res.redirect("/admin/dashboard");
    } else {
      return res.redirect("/student/dashboard");
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.render("error", {
      message: "An error occurred during login. Please try again later.",
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("userRole");
  res.clearCookie("username");
  res.redirect("/");
};
