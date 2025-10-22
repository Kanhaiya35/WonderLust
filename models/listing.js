const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "No description provided."
  },
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default: "https://unsplash.com/photos/boat-on-canal-passing-by-amsterdam-houses-and-trees-D0m9WVJPd6M",
    },
  },
  price: {
    type: Number,
    required: true,
    default: 0, // ✅ prevents undefined errors
    min: [0, "Price cannot be negative"]
  },
  location: {
    type: String,
    default: "Unknown location"
  },
  country: {
    type: String,
    default: "Unknown country"
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
