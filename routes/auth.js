const express = require('express')
const router = express.Router()

// middleware
import {requireSignIn} from '../middlewares'

// controllers
import {currentUser, forgotPassword, login, logout, register, sendTestEmail} from '../controllers/auth'

// routes
router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/current-user', requireSignIn, currentUser)
router.get('/send-email', sendTestEmail)
router.get('/forgot-password', forgotPassword)

module.exports = router