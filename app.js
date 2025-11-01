const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Reviews = require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

// MongoDB Connection
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to MongoDB");
}
main().catch(err => console.error("Mongo Connection Error:", err));

// EJS Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Root Route
app.get("/", (req, res) => {
  res.send("Hii, I am root");
});

// Validation Middlewares
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// INDEX Route - Show all listings
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// NEW Route - Show form to create new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE Route - Add new listing
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// SHOW Route - Show one listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) throw new ExpressError(404, "Listing Not Found!");
  res.render("listings/show.ejs", { listing });
}));

// EDIT Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing Not Found!");
  res.render("listings/edit.ejs", { listing });
}));

// UPDATE Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// DELETE Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

// REVIEWS
// POST Route - Create review
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) throw new ExpressError(404, "Listing not found!");

  let newReview = new Reviews(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));

// DELETE Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Reviews.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

// 404 Handler (Fixed syntax)
app.all("/listings/:id,/listings/:id/edit ,/listings,/listings/new,/", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Server Start
app.listen(8080, () => {
  console.log("🚀 Server running on port 8080");
});
