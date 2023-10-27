const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userImageSchema = new Schema({
  url: String,
  filename: String,
});

// Virtual Schema, be an array of userImages. Modify the contents of the URL.
userImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const ReviewSchema = new Schema({
  userImages: [userImageSchema],
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
