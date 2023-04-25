const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    mobile: Joi.string().required(),
    password: Joi.string().min(8).required(),
    year: Joi.number().required(),
    collegeName: Joi.string().required(),
    department: Joi.string().required(),
    accomodation: Joi.string().required(),
    collegeEmail: Joi.string().email().lowercase().required()
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const gamindromeSchema = Joi.object({
    accessToken: Joi.string().required(),
    eventName: Joi.string().required(),
    member1 : Joi.string().required(),
    riotId1: Joi.string().regex(/[#][0-9]{4}$/).required(),
    discordId1: Joi.string().regex(/[#][0-9]{4}$/).allow(''),
    member2 : Joi.string().required(),
    riotId2: Joi.string().regex(/[#][0-9]{4}$/).required(),
    discordId2: Joi.string().regex(/[#][0-9]{4}$/).allow(''),
    member3 : Joi.string().required(),
    riotId3: Joi.string().regex(/[#][0-9]{4}$/).required(),
    discordId3: Joi.string().regex(/[#][0-9]{4}$/).allow(''),
    member4 : Joi.string().required(),
    riotId4: Joi.string().regex(/[#][0-9]{4}$/).required(),
    discordId4: Joi.string().regex(/[#][0-9]{4}$/).allow(''),
    member5 : Joi.string().required(),
    riotId5: Joi.string().regex(/[#][0-9]{4}$/).required(),
    discordId5: Joi.string().regex(/[#][0-9]{4}$/).allow('')
})

module.exports = {
    userSchema,
    loginSchema,
    gamindromeSchema
}