const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

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
  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref : "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete",async (listing) => {
  if(listing) {
await Review.deleteMany({_id :{$in: listing.reviews }});
}
});
  

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
