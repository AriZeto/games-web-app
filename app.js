if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/gameApp";

const mongoose = require("mongoose");

const express = require("express");
const app = express();
const methodOverride = require("method-override"); // Necessary for patching via the use of a form.
const port = process.env.PORT || 3000;
const path = require("path");
const Game = require("./models/game"); // Imported Model
const Character = require("./models/character"); // Imported Model
const ejsMate = require("ejs-mate"); // Companion for EJS, allows for scripting, stylesheets, without duplicating code.
const ExpressError = require("./utilities/ExpressError");
const catchAsync = require("./utilities/catchAsync");

const gameRoutes = require("./routes/games");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport"); // Utilized for authentication
const localStrategyPassport = require("passport-local"); // local authentication for passport
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

app.use(express.urlencoded({ extended: true })); // To get information from POST request body. Grants us parsing of req.body.
app.use(methodOverride("_method")); // Necessary for override with POST in use of forms.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate); // Tell express that we want to use ejsMate as the engine, rather than default ejs template.
app.use(express.static(path.join(__dirname, "public"))); // Serve static files, set directory to public.
app.use(mongoSanitize()); // Prohibit mongo/noSQL Injections

const secret = process.env.SECRET || "aBetterSecretForDev!";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});

store.on("error", function (err) {
  console.log("SESSION STORE ERROR", err);
});

const sessionConfiguration = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Expire a week from now, ms, seconds, minutes, hour, days.
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfiguration)); // Pass in configuration for session.
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false })); // Enables all Helmet middleware; Helmet helps secure Express apps by setting HTTP response headers.

app.use(passport.initialize()); // required to initialize passport library.
app.use(passport.session()); // middleware required for passport if we want persistent login sessions. Session MUST be used before this.
passport.use(new localStrategyPassport(User.authenticate())); // Tells passport to use local strategy, where authentication method is located in the User model.

passport.serializeUser(User.serializeUser()); // Tells passport how to serialize a user (how to store a user in a session)
passport.deserializeUser(User.deserializeUser()); // Tells passport how to deserialize a user (how to un-store a user in a session)

// Define middleware for successful flash-connect prompt. Must be set before express-router.
app.use((req, res, next) => {
  res.locals.returnToUrl = req.originalUrl; // Store originalUrl into returnToUrl, such that after login a user is properly redirected.
  res.locals.signedInUser = req.user; // req.user contains deserialized information about the session. Now, in all templates, we have access to signedInUser.
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connection successful!");
  } catch (error) {
    console.log("There was an error...:");
    handleError(error);
  }
};
connectDB();

app.use("/", userRoutes); // Do not prefix user routes, utilize the user routes.
app.use("/games", gameRoutes); // Prefix each route with games, use games routes.
app.use("/games/:id/reviews", reviewRoutes); // Prefix each review route, use reviews routes.

// Define Routes
app.get(
  "/",
  catchAsync(async (req, res) => {
    const featuredChars = await Character.find();
    const featuredGames = await Game.find({ featured: true });
    res.render("home", { featuredGames, featuredChars });
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found...", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err) {
    err.message = "Something went wrong...";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
