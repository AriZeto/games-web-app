const axios = require("axios").default;
const configuration = require("../Credentials/configuration");
const queries = require("./queries");
const pushCharacterData = require("./pushCharacterData");
const gatherCharacters = async (name) => {
  const config = await configuration(await queries(name));
  try {
    const response = await axios.post(config.url[1], config.data[2], config);
    return await pushCharacterData(response);
  } catch (err) {
    console.log("Error in fetching characters...");
    console.log(err);
  }
};

module.exports = gatherCharacters;
