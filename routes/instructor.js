const express = require('express')
const router = express.Router()

// middleware
import {requireSignIn} from '../middlewares'

// controllers
import {currentInstructor, getAccountStatus, makeInstructor} from '../controllers/instructors'

// routes
router.post('/make-instructor', requireSignIn, makeInstructor)
router.post('/get-account-status', requireSignIn, getAccountStatus)

router.get('/current-instructor', requireSignIn, currentInstructor)

module.exports = router