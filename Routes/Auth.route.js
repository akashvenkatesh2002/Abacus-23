const express = require('express')
const router = express.Router()

const controllers = require('../controllers/auth.controller')

router.post('/register', controllers.registerUser)

router.post('/login', controllers.loginUser)

router.delete('/logout', controllers.logoutUser)

router.post('/forgot-password', controllers.forgotPassword)

router.post('/approve-otp', controllers.approveOtp)

router.post('/reset-password', controllers.resetPassword)

router.post('/logout-all-devices', controllers.logoutAll)

router.post('/change-password', controllers.changePassword)

module.exports = router