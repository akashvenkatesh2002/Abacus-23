const JWT = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
    signAccessToken: (userEmail) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: "90 days",
                issuer: "abacus.org.in",
                audience: userEmail
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if(err) reject(err)
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        console.log(req.headers['authorization'])
        if(!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        // console.log("Hii all " + bearerToken)
        const token = bearerToken[0]
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if(err) {
                console.log("Hii guyz " + token)
                return next(createError.Unauthorized())
            }
            console.log("Hii guys " + token)
            req.payload = payload
            next()
        })
    }
}