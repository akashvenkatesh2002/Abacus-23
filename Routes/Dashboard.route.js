const express = require('express')
const router = express.Router()

const controllers = require('../Controllers/dashboard.controller')

router.post('/', controllers.viewDashboard)


router.post('/register/:eventId', controllers.registerEvent)
router.post('/register/:workshopId', controllers.registerWorkshop)

module.exports = router


