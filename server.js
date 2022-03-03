const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const port = process.env.PORT || 8000
require('dotenv').config()

// express config
const app = express()

// middleware - will run before any response is sent back to client
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// routes config
app.get('/', (req, res) => {
    res.send('You hit the Americoders server endpoint!')
})

// port config
app.listen(port, () => {
    console.log(`Americoders server running on port: ${port}`)
})