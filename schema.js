// server side validation of schema
//joi

const Joi=require("joi");

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0), //prevents -ve number
        // image:Joi.object({ 
        //     url:Joi.string().allow("",null), //empty string and null values allowed since mongoose already has default img
        //     filename:Joi.string().allow("",null)
        // }).optional(),
    }).required()
})

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})