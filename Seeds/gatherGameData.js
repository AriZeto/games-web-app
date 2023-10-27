const axios = require("axios").default;
const pushGameData = require("./pushGameData");
const configuration = require("../Credentials/configuration");
const queries = require("./queries");

const gatherGameData = async (name) => {
  const config = await configuration(await queries(name));
  try {
    if (!name) {
      const response = await axios.post(config.url[0], config.data[0], config);
      return await pushGameData(response);
    } else if (name) {
      const response = await axios.post(config.url[0], config.data[1], config);
      return await pushGameData(response);
    }
  } catch (err) {
    console.log("There was an error in generating games...");
    console.log(err);
  }
};

module.exports = { gatherGameData };
