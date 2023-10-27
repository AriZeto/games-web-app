const Game = require("../models/game");
const Review = require("../models/review");
const { cloudinary } = require("../cloudinary");

module.exports.CreateReview = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findById(id); // Find the game by ID.
  const review = new Review(req.body.review); // Pass Review information

  // gather image from user upload on review //
  review.userImages = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  })); // map over array of files, take the path and filename, make a new object for each one, store in an array.
  // gather image from user upload on review //

  review.author = req.user._id; // Set review author to be current user.

  game.reviews.unshift(review); // Push contents of the review to the game
  await review.save();
  await game.save();

  req.flash("success", "Your review has been posted!"); // Utilize flash-connect to prompt success message upon posted review.
  res.redirect(`/games/${game._id}`);
};
module.exports.deleteGameReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Game.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  const review = await Review.findById(reviewId); // Find review so we can delete contents of a user image from Cloudinary once the comment with the image is deleted.
  for (let imgObj of review.userImages) {
    console.log(imgObj);
    await cloudinary.uploader.destroy(imgObj.filename);
  }

  await Review.findByIdAndDelete(reviewId); // Delete review after Cloudinary image that was uploaded is deleted too.

  req.flash("success", "Your review has been deleted."); // Utilize flash-connect to prompt success message upon deleted review.
  res.redirect(`/games/${id}`);
};
