const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Review Schema Definition
const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      minlength: [3, "Comment must be at least 3 characters long"],
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },

    createdAt: {
      type: Date,
      default: Date.now, 
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Review", reviewSchema);
