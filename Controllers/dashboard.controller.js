const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
require('dotenv').config()

const models = require("../database/models");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { userSchema, loginSchema, gamindromeSchema } = require("../Helpers/validation.schema");
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

exports.registerPaidEvent = async (req, res, next) => {
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
        const eventName = req.body.eventName;
        const amount = req.body.amount;

        if (eventName === 'chess') {

            const userChess  = await models.Chess.findOne({where: {abacusId: abacusId}});
            if(userChess) {
                throw new createError("Already registered")
            }

            //do payment only then register


            //code to put in chess table
            await models.Chess.create({
                abacusId: abacusId
            })
            res.json({ "status": 200, "message": "Registration successful!"});
        } else if (eventName === 'gamindrome') {
            
            //validating riotId and discordId
            const result = await gamindromeSchema.validateAsync(req.body)

            const member1 = req.body.member1;
            const member2 = req.body.member2;
            const member3 = req.body.member3;
            const member4 = req.body.member4;
            const member5 = req.body.member5;

            const riotId1 = req.body.riotId1;
            const riotId2 = req.body.riotId2;
            const riotId3 = req.body.riotId3;
            const riotId4 = req.body.riotId4;
            const riotId5 = req.body.riotId5;

            const discordId1 = req.body.discordId1;
            const discordId2 = req.body.discordId2;
            const discordId3 = req.body.discordId3;
            const discordId4 = req.body.discordId4;
            const discordId5 = req.body.discordId5;

            const set = new Set([member1, member2, member3, member4, member5]);
            const memberArray = [member1, member2, member4, member4, member5];
            const setRiot = new Set([riotId1, riotId2, riotId3, riotId4, riotId5]);
            // const setDiscord = new Set([discordId1, discordId2, discordId3, discordId4, discordId5]);

            if(set.size != 5) {
                throw new createError("Enter 5 unique team members!");
            }

            if(setRiot.size != 5) {
                throw new createError("Enter 5 unique Riot IDs!");
            }

            // if(setDiscord.size != 5) {
            //     throw new createError("Enter 5 unique Dis!");
            // }

            //validate abacusId 
            for(let i = 0; i < 5; i++) {
                const user = await models.User.findOne({where: {abacusId : memberArray[i]}});
                if(!user) {
                    throw new createError(`AbacusId Not found for member ${i+1}`);
                }
            }

            //validate if member not in any other team
            for(let i = 0; i < 5; i++) {
                const mem1 = await models.Gamindrome.findOne({where: {member1: memberArray[i]}});
                const mem2 = await models.Gamindrome.findOne({where: {member2: memberArray[i]}});
                const mem3 = await models.Gamindrome.findOne({where: {member3: memberArray[i]}});
                const mem4 = await models.Gamindrome.findOne({where: {member4: memberArray[i]}});
                const mem5 = await models.Gamindrome.findOne({where: {member5: memberArray[i]}});

                let orValue = mem1 || mem2 || mem3 || mem4 || mem5 ;
                console.log("The OR VALUE IS : ", orValue);

                if(orValue) {
                    throw new createError(`Member ${set[i]} already registered in a different team!`);
                }
            }

            //payment

            //insertion
            const insertion = models.Gamindrome.create({
                member1 : memberArray[0],
                member2 : memberArray[1],
                member3 : memberArray[2],
                member4 : memberArray[3],
                member5 : memberArray[4],
                riotId1,
                riotId2,
                riotId3,
                riotId4,
                riotId5,
                discordId1,
                discordId2,
                discordId3,
                discordId4,
                discordId5,
            })
            res.json({"status": 200, "message" : "All members registered successfully!"});
        }
    } catch(error) {
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
            // const isPassBought = user.isPassBought;

            const isAbacusId = await models.Events.findOne({
                where: {
                    abacusId: abacusId
                }
            });

            if (isAbacusId) {
                const eventIdArray = isAbacusId.eventId;

                if (eventIdArray.includes(ID)) {
                    throw new createError("Already registered for the Event!");
                }

                const retValue = await models.Events.update(
                    {
                        eventId: sequelize.fn('array_cat', sequelize.col('eventId'), [ID])
                    },
                    {
                        where: { abacusId: abacusId }
                    }
                )
                res.status(201).send({ message: "Event Registered Successfully!" })

            } else {
                console.log("5 " + "Inside IF of Else");
                const retValue = await models.Events.create(
                    {
                        eventId: [ID],
                        abacusId: abacusId
                    }
                )
                res.status(201).send({ message: "Event Registered Successfully!" })
            }
        } catch (error) {
            next(error)
        }
    }

    exports.registerWorkshop = async (req, res, next) => {

        //make an axios call







        // try {
        //     const WId = req.params.workshopId;
        //     const accessToken = req.body.accessToken
        //     const accessTokenDetails = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('ascii'))
        //     const email = accessTokenDetails.aud

        //     const user = await models.User.findOne({
        //         where: {
        //             email: email
        //         }
        //     })

        //     const abacusId = user.abacusId;

        //     const isAbacusId = await models.Workshops.findOne({
        //         where: {
        //             abacusId: abacusId
        //         }
        //     });

        //     if (isAbacusId) {
        //         const workshopIdArray = isAbacusId.workshopId;
        //         if (workshopIdArray.includes(workshopId)) {
        //             throw new createError("Already registered for the workshop!");
        //         }

        //         //payment
        //         // if payment successful {
        //         const retValue = await models.Workshops.update(
        //             {
        //                 workshopId: sequelize.fn('array_append', sequelize.col('workshopId'), workshopId)
        //             },
        //             {
        //                 where: { abacusId: abacusId }
        //             }
        //         )
        //         res.status(201).send({ message: "Workshop Registered Successfully!" })
        //         //} else {
        //         throw new createError("Payment unsuccessful!!");
        //         //redirect to homepage
        //         // }
        //     } else {
        //         //payment
        //         //if payment successful {
        //         const retValue = await models.Workshops.create({
        //             abacusId: abacusId,
        //             workshopId: [WId],
        //         })
        //         res.status(201).send({ message: "Workshop Registered Successfully!" })
        //         //} else {
        //         // throw new createError("Payment unsuccessful!!"); --TO BE WRITTEN IN ELSE
        //         //redirect to homepage
        //         //}
        //     }
        // } catch (error) {
        //     next(error)
        // }
    }