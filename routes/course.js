const express = require('express')
const router = express.Router()

// middleware
import {isInstructor, requireSignIn} from '../middlewares'

// controllers
import {createCourse, readCourseData, removeImage, uploadImage} from '../controllers/course'

// routes

// image routes
router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

// course routes
router.post('/course', requireSignIn, isInstructor, createCourse) // must be a logged-in instructor for request
router.get('/course/:slug', readCourseData)

module.exports = router