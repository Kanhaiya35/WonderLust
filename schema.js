const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(""),
    image: Joi.string().allow(""),
    price: Joi.number().min(0).required(),
    location: Joi.string().allow(""),
    country: Joi.string().allow("")
  }).required()
});
