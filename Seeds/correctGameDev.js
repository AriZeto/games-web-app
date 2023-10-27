const correctGameDev = async (gameTitle) => {
  if (gameTitle === "Elden Ring") {
    return "FromSoftware";
  }
  if (gameTitle === "Red Dead Redemption 2") {
    return "Rockstar";
  }
  return;
};

module.exports = correctGameDev;
