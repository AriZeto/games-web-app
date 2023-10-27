const { gatherGameData } = require("./gatherGameData");
const Game = require("../models/game"); // Import game Model.

const featuredGames = [
  "Armored Core VI: Fires of Rubicon",
  "Final Fantasy XVI",
  "Elden Ring",
  "Street Fighter 6",
  "Super Mario RPG",
  "Red Dead Redemption 2",
];

const writeFeaturedGames = async () => {
  for (let name of featuredGames) {
    const featuredGamesData = await gatherGameData(name);
    const gameData = featuredGamesData[0];

    const newGame = new Game({
      author: "653b050cbf3ed7feb171890e",
      title: gameData[0],
      summary: gameData[1],
      artworks: gameData[3],
      cover: gameData[5],
      year: gameData[2],
      developer: gameData[4],
      storyline: gameData[7],
      screenshots: gameData[8],
      videos: gameData[9],
      featured: true,
    });
    await newGame.save();
  }
};

module.exports = { writeFeaturedGames };
