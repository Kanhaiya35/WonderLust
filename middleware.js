const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// -----------------------------
// LOGIN CHECK
// -----------------------------
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

// -----------------------------
// SAVE REDIRECT URL
// -----------------------------
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// -----------------------------
// LISTING OWNER CHECK
// -----------------------------
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  if (!req.user) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do NOT have permission!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// -----------------------------
// LISTING VALIDATION (FIXED FOR FILE UPLOADS)
// -----------------------------
// LISTING VALIDATION (FIXED FOR FILE UPLOADS)
module.exports.validateListing = (req, res, next) => {
  // Create a copy of req.body for validation
  let listingData = { ...req.body };
  
  // If a file was uploaded, create a mock image object for validation
  if (req.file) {
    listingData.listing = {
      ...listingData.listing,
      image: {
        url: req.file.path,
        filename: req.file.filename
      }
    };
  }
  
  const { error } = listingSchema.validate(listingData);
  
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  
  next();
};
// -----------------------------
// REVIEW VALIDATION
// -----------------------------
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};

// -----------------------------
// REVIEW AUTHOR CHECK
// -----------------------------
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  if (!req.user) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are NOT the author of this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};