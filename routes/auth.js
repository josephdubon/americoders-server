const express = require('express')
const router = express.Router()

// Register
router.get('/register', (req, res) => {
    res.send('Register user')
})

module.exports = router