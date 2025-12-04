const Listing = require("../models/listing");

// SHOW ALL LISTINGS
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// RENDER NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW SINGLE LISTING
module.exports.showlisting = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// CREATE NEW LISTING
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Important

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// RENDER EDIT FORM
module.exports.editform = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing Not Found!");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
};

// UPDATE LISTING
module.exports.updateform = async (req, res) => {
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
};

// DELETE LISTING
module.exports.deleteListng = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
