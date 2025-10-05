const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// View Engine Setup
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

// INDEX Route - Show all listings
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// NEW Route - Form to create new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE Route - Add new listing to DB
app.post("/listings", wrapAsync(async (req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"send vaild data for listing")
    }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// SHOW Route - Show details for one listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing Not Found!");
  res.render("listings/show.ejs", { listing });
}));

// EDIT Route - Form to edit a listing
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing Not Found!");
  res.render("listings/edit.ejs", { listing });
}));

// UPDATE Route - Save edited listing
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"send vaild data for listing")
    }
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

// DELETE Route - Delete a listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

// Handle All Other Routes (404)
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

// Start Server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
