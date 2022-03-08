const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const {readdirSync} = require('fs')
const port = process.env.PORT || 8000
require('dotenv').config()

// express config
const app = express()

// middleware - will run before any response is sent back to client
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// routes config - use filesystem to generate list of routes from our /routes/ dir
readdirSync('./routes').map((r) => {
    // prefix all routes with /api/
    app.use('/api', require(`./routes/${r}`))
})

// port config
app.listen(port, () => {
    console.log(`Americoders server running on port: ${port}`)
})