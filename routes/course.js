const express = require('express')
const router = express.Router()

// middleware
import {isInstructor, requireSignIn} from '../middlewares'

// controllers
import {createCourse, removeImage, uploadImage} from '../controllers/courses'

// routes

// image routes
router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

// course routes
router.post('/course', requireSignIn, isInstructor, createCourse) // must be a logged-in instructor for request

module.exports = router