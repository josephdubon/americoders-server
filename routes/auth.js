import express from 'express'

// middleware
import { requireSignIn } from '../middlewares'

// controllers
import {
  currentUser,
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  sendTestEmail,
  updateUser,
} from '../controllers/auth'

// add router
const router = express.Router()

// routes
router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

router.post('/update-user', requireSignIn, updateUser)

router.get('/logout', logout)
router.get('/current-user', requireSignIn, currentUser)
router.get('/send-email', sendTestEmail)

module.exports = router
