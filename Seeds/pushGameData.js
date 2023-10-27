const missingStory = require("./missingStory");
const correctGameDev = require("./correctGameDev");

const pushGameData = async (response) => {
  const gameArr = [];
  for (let resp of response.data) {
    // Refactor this later.
    if (resp.name === "Red Dead Redemption 2" || resp.name === "Elden Ring")
      resp.involved_companies[0].company.name = await correctGameDev(resp.name);
    if (resp.storyline === undefined) {
      resp.storyline = await missingStory(resp.storyline, resp.name);
    }
    gameArr.push([
      resp.name,
      resp.summary,
      resp.release_dates[0].y,
      resp.artworks,
      resp.involved_companies[0].company.name,
      resp.cover.url.replace("t_thumb", "t_1080p"),
      resp.aggregated_rating,
      resp.storyline,
      resp.screenshots,
      resp.videos,
    ]);
  }
  return gameArr;
};

module.exports = pushGameData;
