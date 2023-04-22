const models = require("../database/models");
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const shortid = require('shortid');
const razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');
//const instance = require("../app.js");
const instance = new razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_APT_SECRET,
});
exports.checkout = async (req, res, next) => {
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        order,
        amount,
    });
};

exports.paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Database comes here

        await models.paymentSchema.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        res.redirect(
            `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
        );
    } else {
        res.status(400).json({
            success: false,
        });
    }
};
//------------------------------------------------------
exports.verification = async (req, res) => {

	console.log(req.body)
    
	const crypto = require('crypto')
    console.log(process.env.RAZORPAY_API_SECRET);
	const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
    
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// await models.paymentSchema.create({
        //     razorpay_order_id,
        //     razorpay_payment_id,
        //     razorpay_signature,
        // });

		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
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
};

exports.paymentgateway = async (req, res) => {
    const payment_capture = 1
	const amount = req.body.amount
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await instance.orders.create(options)
       
		console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
};