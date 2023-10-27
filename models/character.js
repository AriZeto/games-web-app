const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const CharacterSchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  mugshot: {
    required: true,
    type: Array,
  },
});

module.exports = mongoose.model("Character", CharacterSchema);
