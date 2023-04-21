const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    mobile: Joi.string().required(),
    password: Joi.string().min(8).required(),
    year: Joi.number().required(),
    collegeName: Joi.string().required(),
    department: Joi.string().required(),
    accomodation: Joi.string().required()
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

module.exports = {
    userSchema,
    loginSchema
}