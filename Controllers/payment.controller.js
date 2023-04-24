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

	console.log("Printing req.body in verification func :", req.body)
    
	const crypto = require('crypto')
    console.log(process.env.RAZORPAY_API_SECRET);
    console.log(req.body);
	const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
    
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')
    console.log("THE DIGEST IS " + digest);
    console.log("THE HEADER-RAZORPAY-IS " + req.headers['x-razorpay-signature']);

	// if (digest === req.headers['x-razorpay-signature']) {
        try{
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
        if(req.headers["workshopId"]) {
            const workshopId = req.headers["workshopId"];
            const isAbacusId = await models.Workshops.findOne({
                where: {
                    abacusId: abacusId
                }
            });

            if(isAbacusId) {
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
        } else if (req.headers["eventPass"]) {
            const userUpdated = await models.User.udpate(
                {
                    isPassBought: true
                },
                {
                    where: { abacusId : abacusId }
                }
            )
        }
        res.status(200).json({
            success: true,
            order,
            amount,
        });
    // } else {
    }catch{
        res.status(400).json({
            success: false,
        });
    }
    //res.json({ status: 'ok' })
};

exports.paymentgateway = async (req, res) => {
    const payment_capture = 1
    // const toBuyEventPass = req.body.toBuyEventPass;
	const amount = req.body.amount;
        
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
        // if (req.headers['authorization']) {
            const response = await instance.orders.create(options)

            console.log(response)

            // this.verification(req, res);
            // console.log('After Verification');

            console.log(response.id +
                + response.currency + 
                response.amount);

            res.status(201).send({ message: {
                id: response.id,
                currency: response.currency,
                amount: response.amount
            }})
        // }

        // else {
        //     throw new createError("Unauthorized!"); 
        // }
    } catch (error) {
        console.log(error)
    }
};