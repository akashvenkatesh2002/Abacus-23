const express = require('express')
const router = express.Router()

const controllers = require('../Controllers/dashboard.controller')

router.post('/', controllers.viewDashboard)


router.post('/register/:eventId', controllers.viewDashboard)
router.post('/register/:workshopId', controllers.viewDashboard)

module.exports = router




