const Joi = require('joi');

const schema = Joi.object({
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

module.exports = schema ; 

