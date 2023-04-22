const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
require('dotenv').config()

const models = require("../database/models");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { userSchema, loginSchema } = require("../Helpers/validation.schema");
const { signAccessToken } = require("../Helpers/jwt_helper");
const sequelize = require("sequelize");

exports.viewDashboard = async (req, res, next) => {
    try {

        const accessToken = req.body.accessToken
        const accessTokenDetails = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('ascii'))
        const email = accessTokenDetails.aud

        const user = await models.User.findOne({
            where: {
                email: email
            }
        })

        const abacusId = user.abacusId;
        const name = user.name
        const emailId = user.email
        const mobile = user.mobile
        const collegeName = user.collegeName
        const department = user.department
        const year = user.year
        const accomodation = user.accomodation

        res.status(201).send({ message: "Dashboard", data: { abacusId: abacusId, name: name, email: emailId, mobile: mobile, collegeName: collegeName, department: department, year: year, accomodation: accomodation } })

    } catch (error) {
        next(error)
    }
}

exports.registerEvent = async (req, res, next) => {
    try {

        const ID = req.params.eventId;
        const accessToken = req.body.accessToken
        const accessTokenDetails = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('ascii'))
        const email = accessTokenDetails.aud

        const user = await models.User.findOne({
            where: {
                email: email
            }
        })

        const abacusId = user.abacusId;
        const isPassBought = user.isPassBought;

        //if (pass bought) no payment
        //else {
        //    payment
        //    
        //    if (payment successful) {
        //       enter in db   
        //    } else {
        //       throw error
        //    }
        //PAYEMENT 

        /*
        const [user, created] = await User.findOrCreate({
            where: { abacusId : abacusId },
            {
                eventId: sequelize.fn('array_append', sequelize.col('eventId'), eventId)
             },
          });
        
        console.log(user.username); // 'sdepold'
        console.log(user.job); // This may or may not be 'Technical Lead JavaScript'
        console.log(created);
        */

        //if payment successful
        const isAbacusId = await models.Events.findOne({
            where: {
                abacusId: abacusId
            }
        });

        if (isAbacusId && isPassBought === true) {
            const retValue = await models.Events.update(
                {
                    eventId: sequelize.fn('array_cat', sequelize.col('eventId'), ID)
                },
                {
                    where: { abacusId: abacusId }
                }
            )
            // retValue.save() 
        } else {
            if (isPassBought === true) {
                const retValue = await models.Events.create({
                    abacusId: abacusId,
                    eventId: sequelize.fn('array_cat', sequelize.col('eventId'), ID),
                    // isPaid: true
                })
            }

            else {
                //Handle buy pass in frontend
                throw new createError.Conflict("Please buy the pass for registering for an event");
            }

            // retValue.save();
        }

        res.status(201).send({ message: "Event Registered Successfully!" })

    } catch (error) {
        next(error)
    }
}

exports.registerWorkshop = async (req, res, next) => {
    try {

        const { workshopId } = req.params;
        const accessToken = req.body.accessToken
        const accessTokenDetails = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('ascii'))
        const email = accessTokenDetails.aud

        const user = await models.User.findOne({
            where: {
                email: email
            }
        })

        const abacusId = user.abacusId;

        //PAYEMENT 

        //if payment successful
        const isAbacusId = await models.Workshops.findOne({
            where: {
                abacusId: abacusId
            }
        });

        if (isAbacusId) {
            const retValue = await models.Workshops.update(
                {
                    eventId: sequelize.fn('array_append', sequelize.col('eventId'), eventId)
                },
                {
                    where: { abacusId: abacusId }
                }
            )
        } else {
            const retValue = await models.Workshops.create({
                abacusId: abacusId,
                workshopId: sequelize.fn('array_append', sequelize.col('workshopId'), workshopId),
                isPaid: true
            })
        }

        res.status(201).send({ message: "Workshop Registered Successfully!" })

    } catch (error) {
        next(error)
    }
}