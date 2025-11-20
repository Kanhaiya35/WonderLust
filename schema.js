const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),

    // 🎯 CRITICAL FIX: The 'image' field must be defined as an object
    image: Joi.object({
      url: Joi.string().allow('', null), // Validate the nested URL field
      filename: Joi.string().allow('', null) // Include the filename field as well (optional)
    }).allow(null).allow(''), // Allow the entire image object to be null or an empty string for safety
    
    price: Joi.number().min(0).required(),
    location: Joi.string().allow(""),
    country: Joi.string().allow("")
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required()
})