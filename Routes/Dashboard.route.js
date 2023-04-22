const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../Helpers/jwt_helper')

const controllers = require('../Controllers/dashboard.controller')

router.post('/', controllers.viewDashboard)

router.post('/register/:eventId', verifyAccessToken, controllers.registerEvent)
router.post('/register/:workshopId', verifyAccessToken, controllers.registerWorkshop)

module.exports = router