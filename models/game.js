const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review"); // Import so we may trigger the some middleware.
const GameSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  summary: {
    required: true,
    type: String,
  },
  artworks: {
    required: true,
    type: Array,
  },
  cover: {
    required: true,
    type: String,
  },
  year: {
    required: true,
    type: Number,
  },
  developer: {
    required: true,
    type: Array,
  },
  storyline: {
    required: false,
    type: String,
  },
  screenshots: {
    required: true,
    type: Array,
  },
  videos: {
    required: true,
    type: Array,
  },
  featured: {
    default: false,
    required: false,
    type: Boolean,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", // Utilize User Model, as there may be many users per game.
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // Utilize the Review Model from review.js, as there may be many reviews per game.
    },
  ],
});

// Designed such that when a user deletes a game, it triggers the ability to delete all specified strings within the 'reviews' of the schema.
GameSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews, // delete review doc in the specified reviews array of the GameSchema
      },
    });
  }
});

module.exports = mongoose.model("Game", GameSchema);
