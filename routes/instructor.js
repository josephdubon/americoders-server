const express = require('express')
const router = express.Router()

// middleware
import {requireSignIn} from '../middlewares'

// controllers
import {currentInstructor, getAccountStatus, instructorCourses, makeInstructor} from '../controllers/instructor'

// routes
router.post('/make-instructor', requireSignIn, makeInstructor)
router.post('/get-account-status', requireSignIn, getAccountStatus)

router.get('/current-instructor', requireSignIn, currentInstructor)
router.get('/instructor-courses', requireSignIn, instructorCourses)

module.exports = router