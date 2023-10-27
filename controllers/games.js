const Game = require("../models/game");

module.exports.index = async (req, res) => {
  const allGames = await Game.find({ featured: false });
  const featuredGames = await Game.find({ featured: true });
  res.render("games/index", { allGames, featuredGames });
};

module.exports.renderNewGameForm = (req, res) => {
  res.render("games/new");
};

module.exports.CreateGame = async (req, res) => {
  const newGame = new Game(req.body.game);
  newGame.author = req.user._id;
  await newGame.save();
  console.log(newGame);
  req.flash("success", "Successfully made a new game!"); // Utilize flash-connect to prompt success message upon creation of new game.
  res.redirect(`/games/${newGame._id}`);
};

module.exports.showGamePage = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      }, // Populate all the reviews from the reviews array on the game, then populate on each review -> their author, and separately, populate the one author on the game.
    })
    .populate("author");
  if (!game) {
    req.flash("error", "Can't find the game you were looking for..."); // If the game is not found, flash error message and redirect. Make this a reusable function later.
    return res.redirect("/games");
  }
  res.render("games/show", { game });
};

module.exports.renderEditGameForm = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findById(id);
  if (!game) {
    req.flash("error", "Can't find the game you were looking for..."); // If the game is not found, flash error message and redirect. Make this a reusable function later.
    return res.redirect("/games");
  }
  res.render("games/edit", { game });
};

module.exports.updateShowGamePage = async (req, res) => {
  const { id } = req.params;
  const game = await Game.findByIdAndUpdate(id, { ...req.body.game });
  req.flash("success", "Successfully updated the game!"); // Utilize flash-connect to prompt success message upon update of a game.
  res.redirect(`/games/${game._id}`);
};

module.exports.deleteGamePage = async (req, res) => {
  const { id } = req.params;
  await Game.findByIdAndDelete(id);
  req.flash("success", "Your game has been deleted."); // Utilize flash-connect to prompt success message upon deleted game.
  res.redirect("/games");
};
