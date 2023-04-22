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
        console.log("1 " + ID);
        const user = await models.User.findOne({
            where: {
                email: email
            }
        })
        console.log("2 " + user);
        const abacusId = user.abacusId;
        const isPassBought = user.isPassBought;
        console.log("3 " + abacusId);

        //if isPassBought true {
        const isAbacusId = await models.Events.findOne({
            where: {
                abacusId: abacusId
            }
        });
        console.log("4 " + isAbacusId);
        if (isAbacusId && isPassBought) {
            console.log("\nInside isAbacus")
            const eventIdArray = isAbacusId.eventId;
            // console.log("Event Array: " + eventIdArray)
            if (eventIdArray.includes(ID)) {
                throw new createError("Already registered for the Event!");
            }
            // console.log("Before ABCD")    
            const retValue = await models.Events.update(
                {
                    eventId: sequelize.fn('array_cat', sequelize.col('eventId'), [ID])
                },
                {
                    where: { abacusId: abacusId }
                }
            )
            // retValue.save() 
            // console.log("After ABCD")
            res.status(201).send({ message: "Event Registered Successfully!" })

        } else {
            if (isPassBought) {
                console.log("5 " + "Inside IF of Else");
                const retValue = await models.Events.create(
                    {
                        eventId: [ID],
                        abacusId: abacusId
                    }
                )
                res.status(201).send({ message: "Event Registered Successfully!" })
            }
            else {
                //Handle buy pass in frontend, successful and unsuccessful
                // res.redirect("/razorpay");
                throw new createError.Conflict("Please buy the pass for registering for an event");
            }
        }


        // } else {

        //}
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

        const isAbacusId = await models.Workshops.findOne({
            where: {
                abacusId: abacusId
            }
        });

        if (isAbacusId) {
            const workshopIdArray = isAbacusId.workshopId;
            if (workshopIdArray.includes(workshopId)) {
                throw new createError("Already registered for the workshop!");
            }

            //payment
            // if payment successful {
            const retValue = await models.Workshops.update(
                {
                    workshopId: sequelize.fn('array_append', sequelize.col('workshopId'), workshopId)
                },
                {
                    where: { abacusId: abacusId }
                }
            )
            res.status(201).send({ message: "Workshop Registered Successfully!" })
            //} else {
            throw new createError("Payment unsuccessful!!");
            //redirect to homepage
            // }
        } else {
            //payment
            //if payment successful {
            const retValue = await models.Workshops.create({
                abacusId: abacusId,
                workshopId: sequelize.fn('array_append', sequelize.col('workshopId'), workshopId),
            })
            res.status(201).send({ message: "Workshop Registered Successfully!" })
            //} else {
            throw new createError("Payment unsuccessful!!");
            //redirect to homepage
            //}
        }
    } catch (error) {
        next(error)
    }
}