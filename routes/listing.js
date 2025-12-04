const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

const { isLoggedIn, isOwner, validateListing } = require("../midddleware.js");

// Multer
const multer = require("multer");

// If you want only local upload:
const upload = multer({ dest: "uploads/" });

// If you want Cloudinary storage:
// const { storage } = require("../cloudConfig.js");
// const upload = multer({ storage });

const listingController = require("../controllers/listings.js");


// INDEX + CREATE
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),   // input name from form
    wrapAsync(listingController.createListing)
  );


// NEW — Form
router.get("/new", isLoggedIn, listingController.renderNewForm);


// SHOW + UPDATE + DELETE
router
  .route("/:id")
  .get(wrapAsync(listingController.showlisting))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),   // upload in edit form
    validateListing,
    wrapAsync(listingController.updateform)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListng));


// EDIT — Form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editform)
);

module.exports = router;
