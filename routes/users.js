const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

router.get("/register", users.renderSignupForm);

router.post("/register", catchAsync(users.registerUser));

router.get("/login", users.renderLoginForm);

// Passport provides us with 'authenticate' middleware, takes strategy,
router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.loginFlash
);

router.get("/logout", users.logout);

module.exports = router;
