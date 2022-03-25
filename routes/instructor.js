const express = require('express')
const router = express.Router()

// middleware
import {requireSignIn} from '../middlewares'

// controllers
import {makeInstructor} from '../controllers/instructors'

// routes
router.post('/make-instructor', requireSignIn, makeInstructor)

module.exports = router