const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')

require('dotenv').config()

const uuid = require("short-unique-id")
const models = require("../database/models");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { userSchema, loginSchema } = require("../Helpers/validation.schema");
const { signAccessToken } = require("../Helpers/jwt_helper");
const sequelize = require("sequelize");
const {OAuth2Client} = require('google-auth-library');
const abacusIdGen = new uuid({ length: 8 });

const CLIENT_ID = process.env.GOOGLECLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.GOOGLEREFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
const client = new OAuth2Client(CLIENT_ID);
exports.approveOtp = async (req, res, next) => {
    try {

        const email = req.body.email;
        const otp = req.body.otp;

        const user = await models.User.findOne({
            where: {
                email: email
            }
        })

        if (!user) throw createError.BadRequest(`Email ID not registered`)

        var otpFlag = await bcrypt.compare(otp, user.otp)

        if (!otpFlag) throw createError.BadRequest(`Invalid OTP`)

        var diff = new Date() - user.otpTimestamp

        if ((diff / (1000 * 60)) > 5) throw createError.BadRequest(`OTP expired`)

        res.status(201).send({ message: "OTP verified" })


    } catch (error) {
        next(error)
    }
}

exports.verifyEmail = async (req, res, next, email) => {
    try {
        // const email = req.body.email;

        // const user = await models.User.findOne({
        //     where: {
        //         email: email
        //     }
        // })

        // if (!user) throw createError.BadRequest(`Email ID not registered`)

        // OTP

        const generateRandomString = function (length = 8) {
            return Math.random().toString(20).slice(2, 2 + length)
        }

        const otp = generateRandomString()
        console.log(otp)

        const salt = await bcrypt.genSalt(10)
        const hashedOtp = await bcrypt.hash(otp, salt)

        const userUpdate = await models.User.update(
            {
                otp: hashedOtp,
                otpTimestamp: Date()
            },
            { where: { email: email } }
        )

        async function sendMail() {
            console.log("In email");
            try {
                // const accessToken = await oAuth2Client.getAccessToken()

                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: process.env.USEREMAILID,
                        clientId: CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        // accessToken: accessToken
                    }
                })

                const mailOptions = {
                    from: process.env.USEREMAILID,
                    to: email,
                    subject: 'Email Verification',
                    text: 'OTP to verify email',
                    html: '<p>Your OTP is <b>' + otp + '</b></p>'
                }

                const result = await transport.sendMail(mailOptions)
                return result

            } catch (error) {
                next(error)
            }
        }

        sendMail()
            .then((result) => res.status(201).send({ message: "OTP is sent to your email ID" }))
            .catch((error) => next(error))

    } catch (error) {
        throw error
    }
}

exports.registerUser = async (req, res, next) => {
    try {

        const result = await userSchema.validateAsync(req.body)

        const user = await models.User.findOne({
            where: {
                email: result.email
            }
        });

        if (user) throw createError.Conflict(`${req.body.email} is already registered`)

        const userCollegeEmail = await models.User.findOne({
            where: {
                collegeEmail: result.collegeEmail
            }
        });

        if (userCollegeEmail) throw createError.Conflict(`${req.body.email} is already registered for college email`);


        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(result.password, salt)
        result.password = hashedPassword
        result.abacusId = abacusIdGen()

        let isPass = false;
        const { collegeEmail } = req.body;
        if (collegeEmail.substring(10) === '@student.annauniv.edu') {
            isPass = true;
        }

        result.isPassBought = isPass;
        console.log(result.isPassBought);

        await this.verifyEmail(req, res, next, result.email);
        let savedUser = await models.User.create(result)
        const accessToken = await signAccessToken(savedUser.email)

        const accessTokenUpdate = await models.User.update(
            { accessTokens: [accessToken] },
            { where: { email: result.email } }
        )

        res.status(201).send({ message: "User registered successfully", accessToken: accessToken })
        // const accessToken = 

    } catch (error) {

        if (error.isJoi === true) error.status = 422;

        next(error)
    }
}

exports.loginUser = async (req, res, next) => {
    try {

        const result = await loginSchema.validateAsync(req.body)

        const user = await models.User.findOne({
            where: {
                email: result.email
            }
        })

        if (!user) throw createError.BadRequest(`Invalid Username or Password`)

        var passwordFlag = await bcrypt.compare(result.password, user.password)

        if (!passwordFlag) throw createError.BadRequest(`Invalid Username or Password`)

        var userAccessTokens = user.accessTokens
        console.log(userAccessTokens.length)

        if (userAccessTokens.length >= 4) throw createError.BadRequest(`Too many logins`);

        const accessToken = await signAccessToken(user.email)

        const accessTokenUpdate = await models.User.update(
            { accessTokens: sequelize.fn('array_cat', sequelize.col('accessTokens'), [accessToken]) },
            { where: { email: result.email } }
        )

        res.status(201).send({ message: "Login successful", accessToken: accessToken })

    } catch (error) {

        if (error.isJoi === true) return next(createError.BadRequest("Invalid Username or Password"));

        next(error)

    }
}

exports.logoutUser = async (req, res, next) => {
    try {

        const accessToken = req.body.accessToken;

        const accessTokenDetails = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('ascii'))
        email = accessTokenDetails.aud
        console.log(email)

        const user = await models.User.findOne({
            where: {
                email: email
            }
        })

        if (user.accessTokens.includes(accessToken) == false) throw createError.BadRequest(`Invalid request`);

        const accessTokenDelete = await models.User.update(
            { accessTokens: sequelize.fn('array_remove', sequelize.col('accessTokens'), accessToken) },
            { where: { email: email } }
        )

        res.status(201).send({ message: "Logout successful" })

    } catch (error) {
        next(error)
    }
}
exports.glogin=async(req,res,next)=>{
    let token = req.body.token;
    
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
    }
    verify()
    .then(()=>{
        res.cookie('session-token', token);
        res.send('success')
    })
    .catch(console.error);
}
exports.forgotPassword = async (req, res, next) => {
    try {

        const email = req.body.email;

        const user = await models.User.findOne({
            where: {
                email: email
            }
        })

        if (!user) throw createError.BadRequest(`Email ID not registered`)

        // OTP

        const generateRandomString = function (length = 8) {
            return Math.random().toString(20).slice(2, 2 + length)
        }

        const otp = generateRandomString()

        const salt = await bcrypt.genSalt(10)
        const hashedOtp = await bcrypt.hash(otp, salt)

        const userUpdate = await models.User.update(
            {
                otp: hashedOtp,
                otpTimestamp: Date()
            },
            { where: { email: email } }
        )

        //

        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

        async function sendMail() {

            try {
                const accessToken = await oAuth2Client.getAccessToken()

                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: process.env.USEREMAILID,
                        clientId: CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: accessToken
                    }
                })

                const mailOptions = {
                    from: process.env.USEREMAILID,
                    to: email,
                    subject: 'Password Reset',
                    text: 'OTP to reset password',
                    html: '<p>Your OTP is <b>' + otp + '</b></p>'
                }

                const result = await transport.sendMail(mailOptions)
                return result

            } catch (error) {
                next(error)
            }
        }

        sendMail()
            .then((result) => res.status(201).send({ message: "OTP is sent to your email ID" }))
            .catch((error) => next(error))

    } catch (error) {
        next(error)
    }
}

exports.resetPassword = async (req, res, next) => {
    try {

        const email = req.body.email
        const password = req.body.password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userPasswordUpdate = await models.User.update(
            { password: hashedPassword },
            { where: { email: email } }
        )

        res.status(201).send({ message: "Password reset successful" })

    } catch (error) {
        next(error)
    }
}

exports.logoutAll = async (req, res, next) => {
    try {

        const email = req.body.email

        const user = await models.User.findOne({
            where: {
                email: email
            }
        })

        if (!user) throw createError.BadRequest(`Email ID not registered`)

        const accessTokenUpdate = await models.User.update(
            { accessTokens: [] },
            { where: { email: email } }
        )

        res.status(201).send({ message: "Logout successful from all devices" })

    } catch (error) {
        next(error)
    }
}

exports.changePassword = async (req, res, next) => {
    try {

        const accessToken = req.body.accessToken;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        const accessTokenDetails = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('ascii'))
        email = accessTokenDetails.aud

        const user = await models.User.findOne({
            where: {
                email: email
            }
        })

        var passwordFlag = await bcrypt.compare(oldPassword, user.password)

        if (!passwordFlag) throw createError.BadRequest(`Incorrect Password`)

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        const passwordUpdate = await models.User.update(
            { password: hashedPassword },
            { where: { email: email } }
        )

        res.status(201).send({ message: "Password Updated Successfully" })

    } catch (error) {
        next(error)
    }
}