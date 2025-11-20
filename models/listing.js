const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    trim: true,
  },
  description: {
    type: String,
    default: "No description provided.",
  },
  image: {
  filename: { type: String, default: "listingimage" },
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1758320576708-a60c856c34c4?auto=format&fit=crop&w=870&q=80"
  }
},
  price: {
    type: Number,
    required: [true, "Price is required."],
    min: [0, "Price cannot be negative."],
    default: 0,
  },
  location: {
    type: String,
    default: "Unknown location",
  },
  country: {
    type: String,
    default: "Unknown country",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

// Delete reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
