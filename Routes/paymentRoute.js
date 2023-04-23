const { Router } = require('express');
const controllers = require('../Controllers/payment.controller');
const { verifyAccessToken } = require('../Helpers/jwt_helper')
//const schemas = require('../database/models/paymentSchema');

//const middleware = require('../middleware/');

const router = Router();

//router.post("/checkout", controllers.checkout);
//router.post("/paymentverification", controllers.paymentVerification);
router.post("/verification", controllers.verification);
router.post("/paymentgateway", verifyAccessToken, controllers.paymentgateway);
module.exports = router;

