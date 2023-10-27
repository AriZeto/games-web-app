const express = require("express");
const router = express.Router();
const Game = require("../models/game"); // Imported Model
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, validateGame, isAuthor } = require("../middleware");

const games = require("../controllers/games");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// Define routes
router.get("/", catchAsync(games.index));

router.get(
  "/new",
  isLoggedIn,
  games.renderNewGameForm // isLoggedIn middleware grants permission to do block level code.
);

router.post("/", isLoggedIn, validateGame, catchAsync(games.CreateGame));

router.get("/:id", catchAsync(games.showGamePage));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(games.renderEditGameForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateGame,
  catchAsync(games.updateShowGamePage)
);

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(games.deleteGamePage));

module.exports = router;
