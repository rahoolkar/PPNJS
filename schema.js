const Joi = require('joi');

const listingschema = Joi.object({
    title : Joi.string()
        .required(),

    description : Joi.string()
        .required(),

    image : Joi.string()
        .allow("",null),
    
    price : Joi.number()
        .integer()
        .min(0),

    location : Joi.string()
        .required(),

    country : Joi.string()
        .required()
})

const reviewschema = Joi.object({
    comment : Joi.string()
        .required(),
    
    rating : Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required(),
});

module.exports = {listingschema,reviewschema} ; 

