const express = require("express");
const router = express.Router({ mergeParams: true }); // grant access to ID associated within file and app.js

const Game = require("../models/game"); // Import Models
const Review = require("../models/review");

const catchAsync = require("../utilities/catchAsync");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const reviews = require("../controllers/reviews");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// Define a POST route for reviews per one game. Necessary that we use a nested route such that we have the ID.
router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateReview, // use middleware to validate review and ensure a user is logged in, used for error catching, as well as ensuring no one can submit review using AJAX or Postman, protecting route
  catchAsync(reviews.CreateReview)
);

// To delete a particular review, we need the review id, associated with the game id, as we need to remove the reference as to what the review is (and the review itself).
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteGameReview)
);

module.exports = router;
