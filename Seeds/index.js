if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../.env" });
}

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/gameApp";

const mongoose = require("mongoose");
const Game = require("../models/game"); // Import game Model.
const Character = require("../models/character");
const { gatherGameData } = require("./gatherGameData");
const { writeFeaturedGames } = require("./featuredGames");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    // console.log(dbUrl)
    console.log("MongoDB connection successful!");
  } catch (error) {
    console.log("There was an error connecting to MongoDB...:");
    handleError(error);
  }
};

// Seed the database with curated games list, as well as featured games.
const seedDB = async () => {
  await connectDB();
  await Game.deleteMany({});
  await Character.deleteMany({});

  await writeFeaturedGames(); // Curate page with featured games.

  const gameData = await gatherGameData();
  for (let i = 1; i <= 20; i += 1) {
    const newGame = new Game({
      author: "653b050cbf3ed7feb171890e", // Games will contain the author of this User._id 'name'.
      title: gameData[i][0],
      summary: gameData[i][1],
      artworks: gameData[i][3],
      cover: gameData[i][5],
      year: gameData[i][2],
      developer: gameData[i][4],
      storyline: gameData[i][7],
      screenshots: gameData[i][8],
      videos: gameData[i][9],
      featured: false,
    });
    await newGame.save();
  }
  console.log("SAVING...");
};

// Seed the database then close the connection.
seedDB().then(() => {
  mongoose.connection.close();
});
