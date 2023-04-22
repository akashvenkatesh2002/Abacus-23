const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../Helpers/jwt_helper')

const controllers = require('../Controllers/dashboard.controller')

router.post('/', controllers.viewDashboard)

router.post('/registerEvent/:eventId', verifyAccessToken, controllers.registerEvent)
router.post('/registerWorkshop/:workshopId', verifyAccessToken, controllers.registerWorkshop)

module.exports = router