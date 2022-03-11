const express = require('express')
const router = express.Router()

// controllers
import {login, logout, register} from '../controllers/auth'

// routes
router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

module.exports = router