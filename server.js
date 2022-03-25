import express from 'express'
import cors from 'cors'
import {readdirSync} from 'fs'
import mongoose from 'mongoose'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'

const morgan = require('morgan')
require('dotenv').config()

// initiate csrf protection
const csrfProtection = csrf({
    cookie: true
})

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
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Americoders server running on port: ${port}`)
})