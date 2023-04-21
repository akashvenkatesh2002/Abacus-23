const express = require('express')
const router = express.Router()

const controllers = require('../controllers/dashboard.controller')

router.post('/', controllers.viewDashboard)

module.exports = router


