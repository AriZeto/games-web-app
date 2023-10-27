const Character = require("../models/character"); // Import game Model.
const gatherCharacters = require("./gatherCharacters");
const featuredCharactersArr = [
  "Bowser",
  "Deadpool",
  "Albert Wesker",
  "Pikachu",
  "Batman",
  "Mario",
];

const writeFeaturedChars = async () => {
  for (let character of featuredCharactersArr) {
    const charData = await gatherCharacters(character);
    const newChar = new Character({
      name: charData[0],
      mugshot: charData[1],
      franchise: charData[2],
    });
    await newChar.save();
  }
};

module.exports = { writeFeaturedChars };
