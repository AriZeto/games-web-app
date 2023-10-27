const missingStory = async (gameStoryline, gameTitle) => {
  if (gameTitle === "Super Mario RPG") {
    return (gameStoryline =
      "Team up with an oddball group of heroes to save Star Road and stop the troublemaking Smithy Gang. This colorful RPG has updated graphics and cinematics that add even more charm to the unexpected alliance between Mario, Bowser, Peach, and original characters Mallow and Geno. Enter (or revisit) this world of eccentric allies and offbeat enemies in an RPG for everyone. ");
  }
  if (gameTitle === "Street Fighter 6") {
    return (gameStoryline =
      "Travel the world in your search for the answer to the question of... What is strength? Jump in with your avatar, where legendary fighters await your arrival in the world of Street Fighter!");
  }
  if (gameTitle === "Elden Ring") {
    return (gameStoryline =
      "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.");
  }
  return gameStoryline;
};

module.exports = missingStory;
