const models = require("../database/models");
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const shortid = require('shortid');
const razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');
//const instance = require("../app.js");
// const models = require("../database/models");

const instance = new razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});
// exports.checkout = async (req, res, next) => {
//     const options = {
//         amount: Number(req.body.amount * 100),
//         currency: "INR",
//     };
//     const order = await instance.orders.create(options);

//     res.status(200).json({
//         success: true,
//         order,
//         amount,
//     });
// };

// exports.paymentVerification = async (req, res) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//         req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//         .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
//         .update(body.toString())
//         .digest("hex");

//     const isAuthentic = expectedSignature === razorpay_signature;

//     if (isAuthentic) {
//         // Database comes here

//         await models.paymentSchema.create({
//             razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature,
//         });

//         res.redirect(
//             `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
//         );
//     } else {
//         res.status(400).json({
//             success: false,
//         });
//     }
// };
//------------------------------------------------------
exports.verification = async (req, res) => {
    try {
        // console.log("Printing req.body in verification func :", req.body)
        console.log("Printing response from verification: ", req.body.response);

        const crypto = require('crypto')
        console.log(process.env.RAZORPAY_API_SECRET);
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)

        shasum.update(JSON.stringify(req.body))
        const digest = shasum.digest('hex')

        if (digest === req.headers['x-razorpay-signature']) {
            console.log('request is legit')

            require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))

            const accessToken = req.body.accessToken
            const accessTokenDetails = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('ascii'))
            const email = accessTokenDetails.aud

            const user = await models.User.findOne({
                where: {
                    email: email
                }
            })
            const abacusId = user.abacusId;

            //Insert into the database
            //check in header if this is for workshop or eventPass
            if (req.headers["workshopId"]) {
                const workshopId = req.headers["workshopId"];
                const isAbacusId = await models.Workshops.findOne({
                    where: {
                        abacusId: abacusId
                    }
                });

                if (isAbacusId) {
                    const retValue = await models.Workshops.update(
                        {
                            workshopId: sequelize.fn('array_append', sequelize.col('workshopId'), workshopId)
                        },
                        {
                            where: { abacusId: abacusId }
                        }
                    )
                    res.status(201).send({ message: "Workshop Registered Successfully!" })
                } else {
                    const retValue = await models.Workshops.create({
                        abacusId: abacusId,
                        workshopId: [WId],
                    })
                    res.status(201).send({ message: "Workshop Registered Successfully!" })
                }
            } else if (req.headers["chess"]) {
                const userUpdated = await models.Chess.create(
                    {
                        abacusId: abacusId
                    }
                )
            } else if (req.headers["gamindrome"]) {

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

                const insertion = models.Gamindromes.create({
                    member1: set[0],
                    member2: set[1],
                    member3: set[2],
                    member4: set[3],
                    member5: set[4],
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

            }
            res.status(200).json({
                success: true,
                order,
                amount,
            });
        } else {
            res.status(400).json({
                success: false,
            });
        }
        //res.json({ status: 'ok' })
    } catch (error) {
        next(error);
    }
};

exports.paymentgateway = async (req, res) => {
    const payment_capture = 1
    // const toBuyEventPass = req.body.toBuyEventPass;
    const amount = req.body.amount

    console.log('amount = ', amount);
    // console.log('toBuyEventPass = ', toBuyEventPass);

    const currency = 'INR'

    const options = {
        amount: amount * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture
    }

    try {
        if (req.headers['authorization']) {
            const response = await instance.orders.create(options)

            console.log(response)
            req.body.response = response;
            this.verification(req, res);

            // res.json({
            //     id: response.id,
            //     currency: response.currency,
            //     amount: response.amount
            // })
        }

        else {
            throw new createError("Unauthorized!");
        }
    } catch (error) {
        console.log(error)
    }
};