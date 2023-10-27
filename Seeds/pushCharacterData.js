const pushCharacterData = async (response) => {
  characterData = [];
  for (let resp of response.data) {
    characterData.push(resp.name);
    console.log(resp.name);
    characterData.push(resp.mug_shot.url.replace("t_thumb", "t_1080p"));
  }
  return characterData;
};

module.exports = pushCharacterData;
