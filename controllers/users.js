const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username }); // Pass in email and username from destructuring.
    const registeredUser = await User.register(user, password); // Will hash the password, store the salts and hash result on the new user.
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      // Establishes login session after the user has registered, pass in registeredUser.
      req.flash("success", "Welcome to Games Web App!");
      res.redirect("/");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginFlash = (req, res) => {
  // If this block is executed, user was authenticated and logged in.
  req.flash("success", "Welcome back!");
  const redirectedUrl = res.locals.returnToUrl || "/";
  if (redirectedUrl == "/login") {
    // If the user clicks the login prompt, devise way to not redirect back to 'login, go to /games/ instead.
    res.redirect("/games");
    return delete req.session.returnToUrl; // Delete object data after user is successfully logged in.
  }
  delete req.session.returnToUrl; // Delete object data after user is successfully logged in.
  res.redirect(redirectedUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // Passport provides us with logout on req.
    req.flash("success", "Goodbye! You are now logged out.");
    res.redirect("/");
  });
};
