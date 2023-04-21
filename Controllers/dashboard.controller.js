const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
require('dotenv').config()

const models = require("../database/models");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const {userSchema, loginSchema} = require("../helpers/validation.schema");
const {signAccessToken} = require("../helpers/jwt_helper");
const sequelize = require("sequelize");

exports.viewDashboard = async(req, res, next) => {
    try {

        const accessToken = req.body.accessToken
        const accessTokenDetails = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('ascii'))
        email = accessTokenDetails.aud

        const user = await models.User.findOne({
            where: {
                email: email
            }
        })

        const name = user.name
        const emailId = user.email
        const mobile = user.mobile
        const collegeName = user.collegeName
        const department = user.department
        const year = user.year
        const accomodation = user.accomodation

        res.status(201).send({ message: "Dashboard",  data: {name: name, email: emailId, mobile: mobile, collegeName: collegeName, department: department, year: year, accomodation: accomodation}})
        
    } catch(error) {
        next(error)
    }
}