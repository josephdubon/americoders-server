const express = require('express')
const router = express.Router()

// middleware
import {requireSignIn} from '../middlewares'

// controllers
import {getAccountStatus, makeInstructor} from '../controllers/instructors'

// routes
router.post('/make-instructor', requireSignIn, makeInstructor)
router.post('/get-account-status', requireSignIn, getAccountStatus)

module.exports = router