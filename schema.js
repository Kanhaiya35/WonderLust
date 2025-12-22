const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),

    
    image: Joi.object({
      url: Joi.string().allow('', null), 
      filename: Joi.string().allow('', null) 
    }).allow(null).allow(''), 
    
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