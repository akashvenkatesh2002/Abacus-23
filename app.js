const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const cors = require('cors')
const Razorpay = require('razorpay')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const { verifyAccessToken } = require('./Helpers/jwt_helper')
const AuthRoute = require('./Routes/Auth.route')
const DashboardRoute = require('./Routes/Dashboard.route')
const PaymentRoute = require('./Routes/paymentRoute')
const { onWebHook } = require('./Controllers/payment.controller')

const app = express()

//remove below line later
app.set('view engine', 'ejs');

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser());

app.get('/', verifyAccessToken, async(req, res, next) => {
    res.send('Hello from Express')
})


app.get('/login', (req,res)=>{
    res.render('view');
})
app.use('/auth', AuthRoute)
app.use('/dashboard', DashboardRoute)
app.use('/payment', PaymentRoute)
app.post('/webhook', onWebHook);

app.use(async(req, res, next) => {
    next(createError.NotFound('This route does not exist'))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send( {
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})


