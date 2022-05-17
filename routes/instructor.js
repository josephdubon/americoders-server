const express = require('express')
const router = express.Router()

// middleware
import {requireSignIn} from '../middlewares'

// controllers
import {
    currentInstructor,
    getAccountStatus,
    instructorBalance,
    instructorCourses,
    instructorPayoutSettings,
    makeInstructor,
    studentCount
} from '../controllers/instructor'

// routes
router.post('/make-instructor', requireSignIn, makeInstructor)
router.post('/get-account-status', requireSignIn, getAccountStatus)

router.get('/current-instructor', requireSignIn, currentInstructor)
router.get('/instructor-courses', requireSignIn, instructorCourses)

router.post('/instructor/student-count', requireSignIn, studentCount)

router.get('/instructor/balance', requireSignIn, instructorBalance)

router.get('/instructor/payout-settings', requireSignIn, instructorPayoutSettings)

module.exports = router