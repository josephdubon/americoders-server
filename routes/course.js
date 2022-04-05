import express from 'express'
import formidable from 'express-formidable'

// middleware
import {isInstructor, requireSignIn} from '../middlewares'

// controllers
import {createCourse, readCourseData, removeImage, removeVideo, uploadImage, uploadVideo} from '../controllers/course'

// add router
const router = express.Router()

// image routes
router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

// video routes
router.post('/course/upload-video/:instructorId', requireSignIn, formidable(), uploadVideo)
router.post('/course/remove-video/:instructorId', requireSignIn, removeVideo)

// course routes
router.get('/course/:slug', readCourseData)

router.post('/course', requireSignIn, isInstructor, createCourse) // must be a logged-in instructor for request
router.get('/course/:slug', readCourseData)

module.exports = router