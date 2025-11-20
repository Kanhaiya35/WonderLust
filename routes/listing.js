const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../midddleware.js");


// -----------------------------
// INDEX — ALL LISTINGS
// -----------------------------
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// -----------------------------
// NEW — FORM
// -----------------------------
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// -----------------------------
// CREATE — NEW LISTING
// -----------------------------
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;   // Important

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
}));

// -----------------------------
// SHOW — SINGLE LISTING
// -----------------------------
router.get("/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate: {
        path : "author",
      },
})
.populate("owner");
    

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
}));

// -----------------------------
// EDIT — FORM
// (ONLY OWNER CAN ACCESS)
// -----------------------------
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
}));

// -----------------------------
// UPDATE — SUBMIT EDIT FORM
// -----------------------------
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;

  const existingListing = await Listing.findById(id);
  if (!existingListing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  const newData = req.body.listing;

  // IMAGE FIX
  const updatedImage =
    newData.image?.url && newData.image.url.trim().length > 0
      ? { url: newData.image.url, filename: existingListing.image.filename || "listingimage" }
      : existingListing.image;

  await Listing.findByIdAndUpdate(id, {
    ...newData,
    image: updatedImage,
  });

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

// -----------------------------
// DELETE — REMOVE LISTING
// (ONLY OWNER CAN DELETE)
// -----------------------------
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}));

module.exports = router;
