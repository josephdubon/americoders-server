const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const csrf = require('csurf')
const cookieParser = require('cookie-parser')
const {readdirSync} = require('fs')

const port = process.env.PORT || 8000

// initiate csrf protection
const csrfProtection = csrf({
    cookie: true
})

require('dotenv').config()

// express config
const app = express()

// database config
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected!'))
    .catch((err) => console.log('MongoDB Connection Error => ', err))

// middleware - will run before any response is sent back to client
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// routes config - use filesystem to generate list of routes from our /routes/ dir
readdirSync('./routes').map((r) => {
    // prefix all routes with /api/
    app.use('/api', require(`./routes/${r}`))
})

// csrf config
app.use(csrfProtection)
app.get('/api/csrf-token', (req, res) => {
    res.json({
        csrfToken: req.csrfToken()
    })
})



// port config
app.listen(port, () => {
    console.log(`Americoders server running on port: ${port}`)
})