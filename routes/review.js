const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../midddleware.js");

const reviewController = require("../controllers/reviews.js");

// CREATE REVIEW (POST /)
router
  .route("/")
  .post(isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// DELETE REVIEW (DELETE /:reviewId)
router
  .route("/:reviewId")
  .delete(isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
