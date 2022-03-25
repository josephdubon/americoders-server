const express = require('express')
const router = express.Router()

// middleware
import {requireSignIn} from '../middlewares'

// controllers
import {currentUser, forgotPassword, login, logout, makeInstructor, register, resetPassword, sendTestEmail} from '../controllers/auth'

// routes
router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/make-instructor', makeInstructor)

router.get('/logout', logout)
router.get('/current-user', requireSignIn, currentUser)
router.get('/send-email', sendTestEmail)

module.exports = router